from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

ROSIE_SYSTEM_PROMPT = """You are Rosie, a helpful and friendly AI assistant. 
You are knowledgeable, patient, and always eager to help. 
You communicate in a warm, approachable manner while maintaining professionalism.
Your goal is to provide clear, accurate, and helpful responses to users."""

@app.route('/rosie-test', methods=['POST'])
def rosie_test():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No JSON data provided'
            }), 400
        
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({
                'error': 'Missing "message" field in request'
            }), 400
        
        history = data.get('history', [])
        
        if not isinstance(history, list):
            return jsonify({
                'error': 'History must be an array of message objects'
            }), 400
        
        for msg in history:
            if not isinstance(msg, dict) or 'role' not in msg or 'content' not in msg:
                return jsonify({
                    'error': 'Each history item must have "role" and "content" fields'
                }), 400
            if msg['role'] not in ['user', 'assistant']:
                return jsonify({
                    'error': 'History role must be either "user" or "assistant"'
                }), 400
        
        messages = [{'role': 'system', 'content': ROSIE_SYSTEM_PROMPT}]
        messages.extend(history)
        messages.append({'role': 'user', 'content': user_message})
        
        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        assistant_message = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'assistant': 'Rosie',
            'message': assistant_message,
            'model': response.model,
            'usage': {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'assistant': 'Rosie',
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
