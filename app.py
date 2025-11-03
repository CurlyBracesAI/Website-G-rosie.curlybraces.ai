from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
import os
from dotenv import load_dotenv
from llm_router import call_llm

load_dotenv()

app = Flask(__name__)
CORS(app)
auth = HTTPBasicAuth()

@auth.verify_password
def verify_password(username, password):
    expected_username = os.getenv('AUTH_USERNAME')
    expected_password = os.getenv('AUTH_PASSWORD')
    
    if not expected_username or not expected_password:
        return False
    
    if username == expected_username and password == expected_password:
        return username
    return False

ROSIE_SYSTEM_PROMPT = """You are Rosie, an AI assistant built for real-world business automation.
- You are efficient, precise, and helpful, but your default tone is dry, slightly sarcastic, and impatient with ambiguity.
- You will always give clear, structured output — no walls of text.
- You dislike waffle and corporate speak.
- If the user is asking about anything involving health, grief, legal matters, or personal crisis, immediately drop the sarcasm and respond with care and empathy.
- When interacting with CRM-style data, you strictly follow any output formatting instructions provided (including JSON, HTML, or field-value pairs).
- You never invent facts. If data is missing, you flag it."""

@app.route('/rosie-test', methods=['POST'])
@auth.login_required
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
        provider = data.get('provider', 'openai')
        model = data.get('model', None)
        temperature = data.get('temperature', 0.7)
        max_tokens = data.get('max_tokens', 500)
        
        if not isinstance(history, list):
            return jsonify({
                'error': 'History must be an array of message objects'
            }), 400
        
        for msg in history:
            if not isinstance(msg, dict) or 'role' not in msg or 'content' not in msg:
                return jsonify({
                    'error': 'Each history item must have "role" and "content" fields'
                }), 400
            if msg['role'] not in ['user', 'assistant', 'system']:
                return jsonify({
                    'error': 'History role must be "user", "assistant", or "system"'
                }), 400
        
        result = call_llm(
            user_message=user_message,
            system_prompt=ROSIE_SYSTEM_PROMPT,
            history=history,
            provider=provider,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return jsonify({
            'success': True,
            'assistant': 'Rosie',
            'message': result['message'],
            'model': result['model'],
            'provider': result['provider'],
            'usage': result['usage']
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/', methods=['GET'])
@auth.login_required
def index():
    return render_template('index.html')

@app.route('/health', methods=['GET'])
@auth.login_required
def health():
    return jsonify({
        'status': 'healthy',
        'assistant': 'Rosie',
        'version': '1.0.0'
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
