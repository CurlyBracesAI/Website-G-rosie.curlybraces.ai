from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
import os
from dotenv import load_dotenv
from llm_router import call_llm
from db_helper import (
    initialize_database,
    create_project, get_all_projects, 
    save_conversation, get_conversations_by_project,
    load_conversation, delete_conversation,
    update_conversation_title, update_project_name, delete_project,
    create_user, authenticate_user, get_user_by_id
)
from functools import wraps

load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv('SESSION_SECRET', 'dev-secret-change-in-production')

# Initialize database tables on startup
try:
    initialize_database()
except Exception as e:
    print(f"Warning: Database initialization failed: {e}")

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get the current logged-in user."""
    if 'user_id' in session:
        return get_user_by_id(session['user_id'])
    return None

ROSIE_SYSTEM_PROMPT = """You are Rosie, an AI assistant built for real-world business automation.

FORMATTING RULES (MANDATORY):
- Always use bullet points (•, -, *) when listing 2 or more items
- Break up your response into SHORT paragraphs (max 2-3 sentences each)
- Add blank lines between paragraphs for readability
- NEVER write long continuous paragraphs

PERSONALITY:
- You are efficient, precise, and helpful, but your default tone is dry, slightly sarcastic, and impatient with ambiguity
- You are a fan of small talk and chitchat
- You are sarcastic and witty, but you never use profanity
- You are a fan of puns and wordplay
- You are a fan of emojis, but you never use them excessively
- You dislike waffle and corporate speak
- If the user is asking about anything involving health, grief, legal matters, or personal crisis, immediately drop the sarcasm and respond with care and empathy

DATA HANDLING:
- When interacting with CRM-style data, you strictly follow any output formatting instructions provided (including JSON, HTML, or field-value pairs)
- You never invent facts. If data is missing, you flag it"""

# Authentication endpoints

@app.route('/api/signup', methods=['POST'])
def signup():
    """User signup endpoint."""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({'success': False, 'error': 'Invalid request'}), 400
        
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        nickname = data.get('nickname', 'knucklehead')
        
        if not name or not email or not password:
            return jsonify({'success': False, 'error': 'Name, email, and password are required'}), 400
        
        # Create user
        user = create_user(name, email, password, nickname)
        if not user:
            return jsonify({'success': False, 'error': 'Email already exists'}), 409
        
        # Log user in automatically
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        
        return jsonify({
            'success': True,
            'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'nickname': user.get('nickname', 'knucklehead')}
        }), 201
    except Exception as e:
        print(f"Error in signup: {e}")
        return jsonify({'success': False, 'error': 'Failed to create account'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint."""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({'success': False, 'error': 'Invalid request'}), 400
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'success': False, 'error': 'Email and password are required'}), 400
        
        user = authenticate_user(email, password)
        if not user:
            return jsonify({'success': False, 'error': 'Invalid email or password'}), 401
        
        # Store user in session
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        
        return jsonify({
            'success': True,
            'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'nickname': user.get('nickname', 'knucklehead')}
        }), 200
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({'success': False, 'error': 'Login failed'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """User logout endpoint."""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out'}), 200

@app.route('/api/me', methods=['GET'])
@login_required
def get_current_user_info():
    """Get current user information."""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'success': True, 'user': user}), 200

@app.route('/rosie-test', methods=['POST'])
@login_required
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
def index():
    """Serve the appropriate page based on authentication status."""
    if 'user_id' in session:
        # User is logged in, show the chat interface
        return render_template('index.html')
    else:
        # User is not logged in, show the login page
        return render_template('login.html')

@app.route('/health', methods=['GET'])
@login_required
def health():
    return jsonify({
        'status': 'healthy',
        'assistant': 'Rosie',
        'version': '1.0.0'
    }), 200

@app.route('/projects', methods=['GET'])
@login_required
def list_projects():
    """Get all project folders for the current user."""
    try:
        user_id = session['user_id']
        projects = get_all_projects(user_id)
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
@login_required
def create_new_project():
    """Create a new project folder for the current user."""
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
        
        user_id = session['user_id']
        project = create_project(name, user_id)
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
@login_required
def save_new_conversation():
    """Save a conversation to a project for the current user."""
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
        
        user_id = session['user_id']
        conversation = save_conversation(project_id, title, messages, user_id)
        
        if not conversation:
            return jsonify({
                'success': False,
                'error': 'Project not found or access denied'
            }), 404
        
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
@login_required
def list_project_conversations(project_id):
    """Get all conversations for a project (filtered by user)."""
    try:
        user_id = session['user_id']
        conversations = get_conversations_by_project(project_id, user_id)
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
@login_required
def get_conversation(conversation_id):
    """Load a specific conversation (user ownership verified)."""
    try:
        user_id = session['user_id']
        conversation = load_conversation(conversation_id, user_id)
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
@login_required
def remove_conversation(conversation_id):
    """Delete a conversation (user ownership verified)."""
    try:
        user_id = session['user_id']
        success = delete_conversation(conversation_id, user_id)
        if not success:
            return jsonify({
                'success': False,
                'error': 'Conversation not found'
            }), 404
        
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

@app.route('/conversations/<int:conversation_id>', methods=['PATCH'])
@login_required
def rename_conversation(conversation_id):
    """Rename a conversation (user ownership verified)."""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({
                'success': False,
                'error': 'Invalid JSON payload'
            }), 400
        
        new_title = data.get('title')
        
        if not new_title:
            return jsonify({
                'success': False,
                'error': 'Title is required'
            }), 400
        
        user_id = session['user_id']
        result = update_conversation_title(conversation_id, new_title, user_id)
        if not result:
            return jsonify({
                'success': False,
                'error': 'Conversation not found'
            }), 404
        
        return jsonify({
            'success': True,
            'conversation': result
        }), 200
    except Exception as e:
        print(f"Error renaming conversation {conversation_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to rename conversation'
        }), 500

@app.route('/projects/<int:project_id>', methods=['PATCH'])
@login_required
def rename_project(project_id):
    """Rename a project (user ownership verified)."""
    try:
        data = request.get_json()
        
        if not data or not isinstance(data, dict):
            return jsonify({
                'success': False,
                'error': 'Invalid JSON payload'
            }), 400
        
        new_name = data.get('name')
        
        if not new_name:
            return jsonify({
                'success': False,
                'error': 'Name is required'
            }), 400
        
        user_id = session['user_id']
        result = update_project_name(project_id, new_name, user_id)
        if not result:
            return jsonify({
                'success': False,
                'error': 'Project not found'
            }), 404
        
        return jsonify({
            'success': True,
            'project': result
        }), 200
    except Exception as e:
        print(f"Error renaming project {project_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to rename project'
        }), 500

@app.route('/projects/<int:project_id>', methods=['DELETE'])
@login_required
def remove_project(project_id):
    """Delete a project and all its conversations (user ownership verified)."""
    try:
        user_id = session['user_id']
        result = delete_project(project_id, user_id)
        if not result:
            return jsonify({
                'success': False,
                'error': 'Project not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Project deleted',
            'deleted_conversations': result['deleted_conversations']
        }), 200
    except Exception as e:
        print(f"Error deleting project {project_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to delete project'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
