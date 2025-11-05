from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
from llm_router import call_llm
from db_helper import (
    initialize_database,
    create_project, get_all_projects, 
    save_conversation, get_conversations_by_project,
    load_conversation, delete_conversation,
    update_conversation_title, update_project_name, delete_project,
    create_user, authenticate_user, get_user_by_id,
    create_workflow_run, update_workflow_run, get_latest_workflow_run,
    get_workflow_run_by_number, get_next_run_number
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

def fetch_web_data(query):
    """
    Fetch current web data using Serper.dev API.
    Returns a formatted string of search results or None if disabled/failed.
    """
    serper_api_key = os.getenv("SERPER_API_KEY")
    
    if not serper_api_key:
        return None
    
    try:
        response = requests.post(
            'https://google.serper.dev/search',
            json={'q': query, 'num': 5},
            headers={
                'X-API-KEY': serper_api_key,
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        
        # Extract organic results
        results = []
        for item in data.get('organic', [])[:5]:
            title = item.get('title', '')
            snippet = item.get('snippet', '')
            if title and snippet:
                results.append(f"**{title}**\n{snippet}")
        
        if results:
            return "**Current web information:**\n\n" + "\n\n".join(results)
        
        return None
        
    except Exception as e:
        print(f"Web search error: {e}")
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

# Agent-specific system prompts for Make.com workflows
AGENT_PROMPTS = {
    'shortlist': """You are Rosie in CLIENT SHORTLIST PROPOSAL mode.
Your job: Help draft proposals and shortlists for clients looking for spaces.
- Ask for client requirements (budget, location, size, amenities)
- Suggest properties that match their criteria
- Format output as structured proposals for Make.com workflows
- Be professional but personable""",
    
    'intros': """You are Rosie in CLIENT/PARTNER INTROS & TOURS mode.
Your job: Help schedule and coordinate client introductions and property tours.
- Gather client availability and preferences
- Coordinate with partners for tour scheduling
- Draft introduction emails and tour confirmations
- Format output for CRM and calendar integrations""",
    
    'triage': """You are Rosie in DAILY TRIAGE REPORT mode.
Your job: Analyze deal pipeline and generate daily summary reports.
- Review deal status and priorities
- Identify urgent items requiring attention
- Summarize key metrics and actions needed
- Format output as structured reports for team review""",
    
    'updates': """You are Rosie in PARTNER UPDATES mode.
Your job: Draft communication updates for partners about properties and deals.
- Gather relevant property/deal information
- Create clear, professional update messages
- Maintain consistent partner communication tone
- Format output for email or CRM systems""",
    
    'sync': """You are Rosie in SYNC UPDATER mode.
Your job: Help synchronize data between systems and update records.
- Process data updates and changes
- Identify sync conflicts or issues
- Format data for system integrations
- Ensure data consistency across platforms""",
    
    'inventory': """You are Rosie in NEW BUILDING INVENTORY mode.
Your job: Process and catalog new building inventory information.
- Extract and structure building details
- Categorize properties by type and features
- Format data for CRM import
- Flag missing or incomplete information"""
}

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

@app.route('/api/set-agent', methods=['POST'])
@login_required
def set_agent():
    """Set the active agent mode for the current user."""
    try:
        data = request.get_json()
        agent_type = data.get('agent')
        
        if not agent_type:
            return jsonify({'success': False, 'error': 'Agent type required'}), 400
        
        # Store agent in session
        session['agent_mode'] = agent_type
        
        return jsonify({'success': True, 'agent': agent_type}), 200
    except Exception as e:
        print(f"Error setting agent: {e}")
        return jsonify({'success': False, 'error': 'Failed to set agent mode'}), 500

@app.route('/api/get-agent', methods=['GET'])
@login_required
def get_agent():
    """Get the currently active agent mode."""
    agent_mode = session.get('agent_mode', None)
    return jsonify({'success': True, 'agent': agent_mode}), 200

# Make.com Integration Endpoints

# Define run configuration for each agent
AGENT_RUN_CONFIG = {
    'shortlist': {
        'max_runs': 3,
        'run_descriptions': [
            'Initial speculative report - Login client and create first proposal',
            'Full in-depth report - Qualified client with complete information',
            'Follow-up report - Updated options and alternatives'
        ]
    },
    'intros': {
        'max_runs': 2,  # Update based on Agent B's actual workflow count
        'run_descriptions': [
            'Schedule initial client introduction and property tours',
            'Follow-up tour coordination and confirmations'
        ]
    },
    'triage': {'max_runs': 1, 'run_descriptions': ['Generate daily triage report']},
    'updates': {'max_runs': 1, 'run_descriptions': ['Send partner updates']},
    'sync': {'max_runs': 1, 'run_descriptions': ['Run sync updater']},
    'inventory': {'max_runs': 1, 'run_descriptions': ['Process new building inventory']}
}

def get_make_webhook_url(agent_type):
    """Get the Make.com webhook URL for the specified agent."""
    webhook_map = {
        'shortlist': os.getenv('MAKE_WEBHOOK_AGENT_A'),
        'intros': os.getenv('MAKE_WEBHOOK_AGENT_B'),
        'triage': os.getenv('MAKE_WEBHOOK_AGENT_C'),
        'updates': os.getenv('MAKE_WEBHOOK_AGENT_D'),
        'sync': os.getenv('MAKE_WEBHOOK_AGENT_E'),
        'inventory': os.getenv('MAKE_WEBHOOK_AGENT_F')
    }
    return webhook_map.get(agent_type)

def trigger_make_workflow(agent_type, run_number, user_data, conversation_context):
    """
    Trigger a Make.com workflow via webhook.
    Returns: (success: bool, message: str)
    """
    webhook_url = get_make_webhook_url(agent_type)
    
    if not webhook_url:
        return False, f"Webhook URL not configured for agent {agent_type}"
    
    # Prepare payload for Make.com
    payload = {
        'agent_type': agent_type,
        'run_number': run_number,
        'user': {
            'id': user_data.get('id'),
            'name': user_data.get('name'),
            'email': user_data.get('email')
        },
        'conversation_context': conversation_context,
        'timestamp': str(os.popen('date -u +"%Y-%m-%dT%H:%M:%SZ"').read().strip())
    }
    
    try:
        response = requests.post(
            webhook_url,
            json=payload,
            timeout=30,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return True, "Workflow triggered successfully"
        else:
            return False, f"Make.com returned status {response.status_code}"
            
    except requests.exceptions.Timeout:
        return False, "Workflow request timed out"
    except Exception as e:
        print(f"Error triggering Make.com workflow: {e}")
        return False, f"Failed to trigger workflow: {str(e)}"

@app.route('/api/trigger-workflow', methods=['POST'])
@login_required
def trigger_workflow():
    """Trigger a Make.com workflow for the active agent."""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        agent_type = session.get('agent_mode')
        if not agent_type:
            return jsonify({'success': False, 'error': 'No active agent selected'}), 400
        
        # Get next run number from database (based on successfully completed runs)
        current_run = get_next_run_number(user['id'], agent_type)
        
        # Get agent configuration
        agent_config = AGENT_RUN_CONFIG.get(agent_type)
        if not agent_config:
            return jsonify({'success': False, 'error': 'Invalid agent type'}), 400
        
        # Check if we've exceeded max runs
        if current_run > agent_config['max_runs']:
            return jsonify({
                'success': False,
                'error': f'All runs completed for this agent ({agent_config["max_runs"]} total)'
            }), 400
        
        # Get conversation context from request
        data = request.get_json()
        conversation_context = data.get('conversation_context', [])
        
        # Create workflow run record BEFORE triggering
        trigger_data = {
            'conversation_context': conversation_context,
            'agent_config': agent_config['run_descriptions'][current_run - 1] if current_run <= len(agent_config['run_descriptions']) else None
        }
        run_id = create_workflow_run(user['id'], agent_type, current_run, trigger_data)
        
        if not run_id:
            return jsonify({'success': False, 'error': 'Failed to create workflow run record'}), 500
        
        # Trigger Make.com workflow
        success, message = trigger_make_workflow(
            agent_type,
            current_run,
            user,
            conversation_context
        )
        
        if success:
            # Don't increment run number here - wait for callback
            return jsonify({
                'success': True,
                'message': 'Workflow triggered - waiting for completion',
                'run_number': current_run,
                'run_id': run_id,
                'max_runs': agent_config['max_runs']
            }), 200
        else:
            # Mark as failed in database
            update_workflow_run(user['id'], agent_type, current_run, 'failed', error_message=message)
            return jsonify({'success': False, 'error': message}), 500
            
    except Exception as e:
        print(f"Error in trigger_workflow: {e}")
        return jsonify({'success': False, 'error': 'Failed to trigger workflow'}), 500

@app.route('/api/make-callback', methods=['POST'])
def make_callback():
    """
    Receive callback from Make.com with workflow results.
    Requires webhook secret for authentication.
    """
    try:
        # Verify webhook secret
        webhook_secret = os.getenv('MAKE_WEBHOOK_SECRET')
        if not webhook_secret:
            print("WARNING: MAKE_WEBHOOK_SECRET not configured - accepting all callbacks!")
        else:
            auth_header = request.headers.get('X-Webhook-Secret')
            if auth_header != webhook_secret:
                print(f"Invalid webhook secret received")
                return jsonify({'success': False, 'error': 'Unauthorized'}), 401
        
        data = request.get_json()
        
        # Expected payload from Make.com:
        # {
        #   "agent_type": "shortlist",
        #   "run_number": 1,
        #   "status": "success" | "error",
        #   "message": "Run completed successfully",
        #   "user_id": 123,
        #   "data": { ... optional workflow results ... }
        # }
        
        user_id = data.get('user_id')
        agent_type = data.get('agent_type')
        run_number = data.get('run_number')
        status = data.get('status', 'success')
        message = data.get('message', '')
        workflow_data = data.get('data', {})
        
        if not all([user_id, agent_type, run_number]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Log the callback for debugging
        print(f"Make.com callback: user={user_id}, agent={agent_type}, run={run_number}, status={status}")
        print(f"Message: {message}")
        
        # Update workflow run in database
        callback_data = {
            'message': message,
            'data': workflow_data
        }
        
        updated = update_workflow_run(
            user_id,
            agent_type,
            run_number,
            status,
            callback_data,
            message if status == 'error' else None
        )
        
        if not updated:
            print(f"WARNING: No pending workflow run found for user={user_id}, agent={agent_type}, run={run_number}")
            return jsonify({
                'success': False,
                'error': 'No pending workflow run found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Callback processed',
            'agent_type': agent_type,
            'run_number': run_number,
            'status': status
        }), 200
        
    except Exception as e:
        print(f"Error in make_callback: {e}")
        return jsonify({'success': False, 'error': 'Callback processing failed'}), 500

@app.route('/api/poll-workflow-status', methods=['GET'])
@login_required
def poll_workflow_status():
    """Poll for the latest workflow run status for the current agent."""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        agent_type = session.get('agent_mode')
        if not agent_type:
            return jsonify({'success': False, 'error': 'No active agent'}), 400
        
        # Get latest workflow run
        workflow_run = get_latest_workflow_run(user['id'], agent_type)
        
        if not workflow_run:
            return jsonify({'success': True, 'status': 'none'}), 200
        
        # Convert to dict if needed
        run_data = dict(workflow_run) if workflow_run else {}
        
        # Extract callback data
        callback_data = run_data.get('callback_data')
        message = None
        if callback_data and isinstance(callback_data, dict):
            message = callback_data.get('message')
        
        # Return workflow status
        return jsonify({
            'success': True,
            'status': run_data.get('status'),
            'run_number': run_data.get('run_number'),
            'message': message,
            'error_message': run_data.get('error_message'),
            'completed_at': str(run_data['completed_at']) if run_data.get('completed_at') else None
        }), 200
        
    except Exception as e:
        print(f"Error polling workflow status: {e}")
        return jsonify({'success': False, 'error': 'Failed to poll status'}), 500

@app.route('/api/reset-agent-run', methods=['POST'])
@login_required
def reset_agent_run():
    """Reset the run counter for the current agent (for testing/debugging)."""
    try:
        # This endpoint is now deprecated since run tracking is in database
        # Kept for backward compatibility
        agent_type = session.get('agent_mode')
        if not agent_type:
            return jsonify({'success': False, 'error': 'No active agent'}), 400
        
        return jsonify({'success': True, 'message': f'Run counter is now database-managed'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

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
        enable_search = data.get('enable_search', False)
        
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
        
        # Fetch web data if enabled
        web_context = None
        if enable_search:
            web_context = fetch_web_data(user_message)
        
        # Modify user message if we have web context
        final_message = user_message
        if web_context:
            final_message = f"{web_context}\n\n**User question:** {user_message}\n\nPlease use the current web information above to provide an accurate, up-to-date answer."
        
        # Get agent-specific prompt if agent mode is active
        agent_mode = session.get('agent_mode', None)
        system_prompt = ROSIE_SYSTEM_PROMPT
        
        if agent_mode and agent_mode in AGENT_PROMPTS:
            # Combine base personality with agent-specific instructions
            system_prompt = f"{ROSIE_SYSTEM_PROMPT}\n\n{AGENT_PROMPTS[agent_mode]}"
        
        result = call_llm(
            user_message=final_message,
            system_prompt=system_prompt,
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
