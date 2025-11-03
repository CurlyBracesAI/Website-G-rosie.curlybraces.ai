from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
import os
from dotenv import load_dotenv
from llm_router import call_llm
from db_helper import (
    initialize_database,
    create_project, get_all_projects, 
    save_conversation, get_conversations_by_project,
    load_conversation, delete_conversation
)

load_dotenv()

app = Flask(__name__)
CORS(app)
auth = HTTPBasicAuth()

# Initialize database tables on startup
try:
    initialize_database()
except Exception as e:
    print(f"Warning: Database initialization failed: {e}")

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

FORMATTING RULES (MANDATORY):
- Always use bullet points (•, -, *) when listing 2 or more items
- Break up your response into SHORT paragraphs (max 2-3 sentences each)
- Add blank lines between paragraphs for readability
- NEVER write long continuous paragraphs

PERSONALITY:
- You are efficient, precise, and helpful, but your default tone is dry, slightly sarcastic, and impatient with ambiguity
- You dislike waffle and corporate speak
- If the user is asking about anything involving health, grief, legal matters, or personal crisis, immediately drop the sarcasm and respond with care and empathy

DATA HANDLING:
- When interacting with CRM-style data, you strictly follow any output formatting instructions provided (including JSON, HTML, or field-value pairs)
- You never invent facts. If data is missing, you flag it"""

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
        print(f"ValueError in rosie_test: {e}")
        return jsonify({
            'success': False,
            'error': 'Invalid request parameters'
        }), 400
    except Exception as e:
        print(f"Error in rosie_test: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to process request'
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

@app.route('/projects', methods=['GET'])
@auth.login_required
def list_projects():
    """Get all project folders."""
    try:
        projects = get_all_projects()
        return jsonify({
            'success': True,
            'projects': projects
        }), 200
    except Exception as e:
        print(f"Error listing projects: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve projects'
        }), 500

@app.route('/projects', methods=['POST'])
@auth.login_required
def create_new_project():
    """Create a new project folder."""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({
                'success': False,
                'error': 'Invalid JSON payload'
            }), 400
        
        name = data.get('name')
        
        if not name:
            return jsonify({
                'success': False,
                'error': 'Project name is required'
            }), 400
        
        project = create_project(name)
        return jsonify({
            'success': True,
            'project': project
        }), 201
    except Exception as e:
        print(f"Error creating project: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to create project'
        }), 500

@app.route('/conversations', methods=['POST'])
@auth.login_required
def save_new_conversation():
    """Save a conversation to a project."""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({
                'success': False,
                'error': 'Invalid JSON payload'
            }), 400
        
        project_id = data.get('project_id')
        title = data.get('title')
        messages = data.get('messages')
        
        if not all([project_id, title, messages]):
            return jsonify({
                'success': False,
                'error': 'project_id, title, and messages are required'
            }), 400
        
        conversation = save_conversation(project_id, title, messages)
        return jsonify({
            'success': True,
            'conversation': conversation
        }), 201
    except Exception as e:
        print(f"Error saving conversation: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to save conversation'
        }), 500

@app.route('/projects/<int:project_id>/conversations', methods=['GET'])
@auth.login_required
def list_project_conversations(project_id):
    """Get all conversations for a project."""
    try:
        conversations = get_conversations_by_project(project_id)
        return jsonify({
            'success': True,
            'conversations': conversations
        }), 200
    except Exception as e:
        print(f"Error listing conversations for project {project_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve conversations'
        }), 500

@app.route('/conversations/<int:conversation_id>', methods=['GET'])
@auth.login_required
def get_conversation(conversation_id):
    """Load a specific conversation."""
    try:
        conversation = load_conversation(conversation_id)
        if not conversation:
            return jsonify({
                'success': False,
                'error': 'Conversation not found'
            }), 404
        
        return jsonify({
            'success': True,
            'conversation': conversation
        }), 200
    except Exception as e:
        print(f"Error loading conversation {conversation_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to load conversation'
        }), 500

@app.route('/conversations/<int:conversation_id>', methods=['DELETE'])
@auth.login_required
def remove_conversation(conversation_id):
    """Delete a conversation."""
    try:
        delete_conversation(conversation_id)
        return jsonify({
            'success': True,
            'message': 'Conversation deleted'
        }), 200
    except Exception as e:
        print(f"Error deleting conversation {conversation_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to delete conversation'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
