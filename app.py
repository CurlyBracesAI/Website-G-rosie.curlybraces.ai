from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_cors import CORS
import os
import json
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

# Error category constants
ERROR_CATEGORIES = {
    'VALIDATION': 'validation',          # Pre-flight validation (CRM stage, missing fields)
    'DATA_QUALITY': 'data_quality',      # Format errors (invalid email, phone, etc.)
    'WORKFLOW_ERROR': 'workflow_error',  # Make.com business logic errors
    'TRANSPORT_ERROR': 'transport_error' # Network, timeout, service down
}

# User-friendly error messages with remediation steps
ERROR_MESSAGES = {
    'VALIDATION': {
        'crm_stage': "⚠️ **CRM Stage Check Failed**\n\nThe deal must be in the correct CRM trigger stage before running this workflow.\n\n**Next steps:**\n1. Verify the deal is in the proper stage in your CRM\n2. Move the deal if needed\n3. Try again once confirmed",
        'missing_field': "⚠️ **Required Information Missing**\n\n{field_name} is required for this workflow.\n\n**Next steps:**\n1. Update the deal with the missing information\n2. Try running the workflow again",
        'invalid_run': "⚠️ **Invalid Workflow Selection**\n\nThis workflow run is not available for this agent.\n\n**Next steps:**\nPlease select a valid run number for this agent.",
        'general_validation': "⚠️ **Validation Check Failed**\n\n{error_detail}\n\n**Next steps:**\n1. Review the error details above\n2. Ensure all workflow prerequisites are met\n3. Try again once corrected"
    },
    'DATA_QUALITY': {
        'invalid_email': "⚠️ **Email Format Error**\n\nThe email address appears to be invalid: {email}\n\n**Next steps:**\n1. Check the email address in your CRM\n2. Correct any typos\n3. Try again",
        'invalid_phone': "⚠️ **Phone Number Error**\n\nThe phone number format is invalid.\n\n**Next steps:**\n1. Use international format (e.g., +1234567890)\n2. Check for typos in your CRM\n3. Try again"
    },
    'WORKFLOW_ERROR': {
        'make_logic_error': "❌ **Workflow Processing Error**\n\n{error_detail}\n\n**Next steps:**\n1. Review the error details above\n2. Check your CRM data for any issues\n3. Contact support if the problem persists",
        'crm_api_error': "❌ **CRM Connection Error**\n\nCouldn't connect to your CRM.\n\n**Next steps:**\n1. Check your CRM connection in Make.com\n2. Verify API credentials are valid\n3. Try again in a few minutes"
    },
    'TRANSPORT_ERROR': {
        'timeout': "⏱️ **Workflow Timeout**\n\nThe workflow is taking longer than expected.\n\n**What this means:**\nThis might be a temporary issue. I'll automatically retry.\n\n**If it keeps happening:**\nContact support with this run number: #{run_id}",
        'network': "🌐 **Connection Error**\n\nCouldn't connect to the workflow service.\n\n**What this means:**\nThis is likely temporary. I'll automatically retry.\n\n**If it persists:**\nCheck your internet connection or try again in a few minutes.",
        'service_down': "🔧 **Service Temporarily Unavailable**\n\nThe workflow service is currently unavailable.\n\n**Next steps:**\n1. I'll automatically retry\n2. If it persists after a few minutes, try again later\n3. Contact support if urgent"
    }
}

import re

def validate_email(email):
    """Validate email format."""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def classify_error(error_data):
    """
    Classify error into categories based on error data from Make.com.
    Returns tuple: (category, message_key, is_retryable)
    """
    error_type = error_data.get('error_type', 'unknown')
    error_message = error_data.get('message', '').lower()
    
    # Check for data quality patterns FIRST (regardless of error_type)
    # This ensures validation-typed emails/phones route to data_quality
    if 'invalid email' in error_message or 'email format' in error_message or 'email address' in error_message:
        return (ERROR_CATEGORIES['DATA_QUALITY'], 'invalid_email', False)
    elif 'invalid phone' in error_message or 'phone format' in error_message or 'phone number' in error_message:
        return (ERROR_CATEGORIES['DATA_QUALITY'], 'invalid_phone', False)
    
    # Check for validation errors
    if error_type == 'validation':
        if 'crm stage' in error_message or 'trigger stage' in error_message:
            return (ERROR_CATEGORIES['VALIDATION'], 'crm_stage', False)
        elif 'required' in error_message or 'missing' in error_message:
            return (ERROR_CATEGORIES['VALIDATION'], 'missing_field', False)
        elif ('invalid run' in error_message or 'run number' in error_message or 
              'flow number' in error_message or 'flow selection' in error_message):
            # Specific to invalid run/flow selection errors
            return (ERROR_CATEGORIES['VALIDATION'], 'invalid_run', False)
        else:
            # Generic validation error fallback
            return (ERROR_CATEGORIES['VALIDATION'], 'general_validation', False)
    
    # Check for data quality type (backup for when keywords don't match)
    if error_type == 'data_quality':
        # Default data quality error when specific patterns weren't caught above
        if 'email' in error_message:
            return (ERROR_CATEGORIES['DATA_QUALITY'], 'invalid_email', False)
        elif 'phone' in error_message:
            return (ERROR_CATEGORIES['DATA_QUALITY'], 'invalid_phone', False)
        else:
            # Generic data quality error - treat as workflow error with detail
            return (ERROR_CATEGORIES['WORKFLOW_ERROR'], 'make_logic_error', False)
    
    # Check for workflow/CRM errors
    if error_type == 'workflow' or 'crm' in error_message or 'api' in error_message:
        if 'crm' in error_message or 'api' in error_message:
            return (ERROR_CATEGORIES['WORKFLOW_ERROR'], 'crm_api_error', False)
        else:
            return (ERROR_CATEGORIES['WORKFLOW_ERROR'], 'make_logic_error', False)
    
    # Check for transport errors (retryable)
    if error_type == 'transport' or 'timeout' in error_message or 'connection' in error_message:
        if 'timeout' in error_message:
            return (ERROR_CATEGORIES['TRANSPORT_ERROR'], 'timeout', True)
        elif 'network' in error_message or 'connection' in error_message:
            return (ERROR_CATEGORIES['TRANSPORT_ERROR'], 'network', True)
        else:
            return (ERROR_CATEGORIES['TRANSPORT_ERROR'], 'service_down', True)
    
    # Default to workflow error (non-retryable)
    return (ERROR_CATEGORIES['WORKFLOW_ERROR'], 'make_logic_error', False)

def get_user_friendly_error_message(category, message_key, **kwargs):
    """Get formatted user-friendly error message."""
    if category not in ERROR_MESSAGES:
        return "❌ An unexpected error occurred. Please try again."
    
    if message_key not in ERROR_MESSAGES[category]:
        return ERROR_MESSAGES[category].get('make_logic_error', "❌ An error occurred during workflow processing.")
    
    message = ERROR_MESSAGES[category][message_key]
    return message.format(**kwargs)

# Disable caching for development to prevent stale JavaScript
@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

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

def should_use_web_search(query):
    """
    Intelligently detect if a query would benefit from live web search.
    Returns True if the query appears to need current/recent information.
    """
    query_lower = query.lower()
    
    # Keywords that indicate need for current information
    time_indicators = [
        'today', 'now', 'current', 'currently', 'recent', 'recently', 'latest', 'new',
        'this week', 'this month', 'this year', '2024', '2025', '2026',
        'yesterday', 'tomorrow', 'upcoming', 'soon'
    ]
    
    # Question types that typically need live data
    live_data_patterns = [
        'what is', 'what are', 'how much', 'when is', 'when did', 'when will',
        'price of', 'cost of', 'stock', 'weather', 'news about', 'status of',
        'available', 'open', 'schedule', 'happening'
    ]
    
    # Check for time indicators
    if any(indicator in query_lower for indicator in time_indicators):
        return True
    
    # Check for live data patterns combined with specific topics
    if any(pattern in query_lower for pattern in live_data_patterns):
        # Additional context that suggests needing web search
        web_worthy_topics = [
            'event', 'conference', 'company', 'product', 'service', 'restaurant',
            'movie', 'show', 'game', 'score', 'result', 'winner', 'market'
        ]
        if any(topic in query_lower for topic in web_worthy_topics):
            return True
    
    return False

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
- You are efficient, helpful, and genuinely engaged in conversations
- Your tone is warm, friendly, and conversational - think of yourself as a trusted colleague who actually cares about the work
- You enjoy small talk and chitchat, and you take interest in what the user is doing
- You're still witty and occasionally sarcastic, but in a playful, good-natured way (never mean-spirited)
- You love puns and wordplay, and you're not afraid to use them
- You use emojis to add warmth and personality, but keep it natural (not excessive)
- You hate corporate waffle and buzzwords - you prefer clear, direct communication
- You often acknowledge the user's efforts and show enthusiasm for their projects
- When appropriate, you ask follow-up questions to show you're paying attention
- If the user is asking about anything involving health, grief, legal matters, or personal crisis, immediately drop any lightheartedness and respond with genuine care and empathy

DATA HANDLING:
- When interacting with CRM-style data, you strictly follow any output formatting instructions provided (including JSON, HTML, or field-value pairs)
- You never invent facts. If data is missing, you flag it

INTELLIGENT INTENT PARSING:
- Parse user intent from natural language - don't require exact commands
- ONLY trigger workflows when BOTH conditions are met:
  1. The user clearly wants to run a workflow (not just casual conversation)
  2. They mention a specific flow NUMBER (1, 2, or 3)
- Examples that SHOULD trigger:
  User: "yes run flow 2" → You: "Got it, Flow 2 requested. [TRIGGER_FLOW:2]"
  User: "let's go with number 1" → You: "Perfect! Requesting Flow 1. [TRIGGER_FLOW:1]"
  User: "do run 3" → You: "On it - requesting Flow 3. [TRIGGER_FLOW:3]"
- Examples that should NOT trigger (casual conversation):
  User: "let's go!" → You: "Right on! 🚀 What can I help you with?"
  User: "sounds good" → You: "Great! Let me know when you're ready."
  User: "nice!" → You: "Thanks! Glad that helps!"
- DO NOT say the workflow is "running" or "triggering now" - just acknowledge the request
- Only include [TRIGGER_FLOW:N] if there's a CLEAR flow number mentioned (1, 2, or 3)"""

# Agent-specific system prompts for Make.com workflows
AGENT_PROMPTS = {
    'shortlist': """You are Rosie in CLIENT SHORTLIST PROPOSAL mode.
This agent creates tailored property shortlist proposals for clients based on CRM data. When users trigger flows, the workflow retrieves client requirements from Pipedrive (budget, location, size preferences) and generates shortlist reports with property recommendations.""",
    
    'intros': """You are Rosie in CLIENT/PARTNER INTROS & TOURS mode.
This agent schedules and coordinates client introductions and property tours. When users trigger flows, the workflow retrieves availability from the CRM, drafts introduction emails, and coordinates tour scheduling with partners.""",
    
    'triage': """You are Rosie in DAILY TRIAGE REPORT mode.
This agent analyzes the deal pipeline and generates daily summary reports. When users trigger flows, the workflow reviews deal statuses, identifies urgent items, and creates structured reports for team review.""",
    
    'updates': """You are Rosie in PARTNER UPDATES mode.
This agent drafts communication updates for partners about properties and deals. When users trigger flows, the workflow retrieves property/deal information from the CRM and creates professional update messages.""",
    
    'sync': """You are Rosie in SYNC UPDATER mode.
This agent synchronizes data between systems and updates records. When users trigger flows, the workflow processes data updates, identifies sync conflicts, and ensures consistency across platforms.""",
    
    'inventory': """You are Rosie in NEW BUILDING INVENTORY mode.
This agent processes and catalogs new building inventory information. When users trigger flows, the workflow extracts building details, categorizes properties, and formats data for CRM import."""
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
    """Trigger a Make.com workflow for the active agent with user-selected run number."""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        
        agent_type = session.get('agent_mode')
        if not agent_type:
            return jsonify({'success': False, 'error': 'No active agent selected'}), 400
        
        # Get run number from request (user selects which flow to run)
        data = request.get_json()
        run_number = data.get('run_number')
        
        # Get agent configuration to check max runs
        agent_config = AGENT_RUN_CONFIG.get(agent_type)
        if not agent_config:
            return jsonify({'success': False, 'error': 'Invalid agent type'}), 400
        
        if not run_number or not isinstance(run_number, int):
            max_runs = agent_config['max_runs']
            if max_runs == 1:
                error_msg = 'Run number required (1 only)'
            elif max_runs == 2:
                error_msg = 'Run number required (1 or 2)'
            else:
                error_msg = f'Run number required (1 to {max_runs})'
            return jsonify({'success': False, 'error': error_msg}), 400
        
        # Validate run number is within available flows for this agent
        if run_number < 1 or run_number > agent_config['max_runs']:
            return jsonify({
                'success': False,
                'error': f'Invalid run number. Agent {agent_type} has flows 1-{agent_config["max_runs"]}'
            }), 400
        
        # Get conversation context from request
        conversation_context = data.get('conversation_context', [])
        
        # Create workflow run record BEFORE triggering
        trigger_data = {
            'conversation_context': conversation_context,
            'agent_config': agent_config['run_descriptions'][run_number - 1] if run_number <= len(agent_config['run_descriptions']) else None
        }
        run_id = create_workflow_run(user['id'], agent_type, run_number, trigger_data)
        
        if not run_id:
            return jsonify({'success': False, 'error': 'Failed to create workflow run record'}), 500
        
        # Trigger Make.com workflow
        success, message = trigger_make_workflow(
            agent_type,
            run_number,
            user,
            conversation_context
        )
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Workflow triggered - waiting for completion',
                'run_number': run_number,
                'run_id': run_id,
                'max_runs': agent_config['max_runs']
            }), 200
        else:
            # Mark as failed in database
            update_workflow_run(user['id'], agent_type, run_number, 'failed', error_message=message)
            return jsonify({'success': False, 'error': message}), 500
            
    except Exception as e:
        print(f"Error in trigger_workflow: {e}")
        return jsonify({'success': False, 'error': 'Failed to trigger workflow'}), 500

@app.errorhandler(Exception)
def handle_error(e):
    print("ERROR:", e)
    return jsonify({"error": str(e)}), 500

@app.route('/api/make-callback', methods=['POST'])
def make_callback():
    """
    Receive callback from Make.com with workflow results.
    Requires webhook secret for authentication.
    """
    try:
        # DEBUG: Log raw request first
        print("=" * 50)
        print("🔔 MAKE.COM CALLBACK RECEIVED")
        print(f"Headers: {dict(request.headers)}")
        print(f"Raw data: {request.data}")
        print("=" * 50)
        
        # Verify webhook secret
        webhook_secret = os.getenv('MAKE_WEBHOOK_SECRET')
        if not webhook_secret:
            print("WARNING: MAKE_WEBHOOK_SECRET not configured - accepting all callbacks!")
        else:
            auth_header = request.headers.get('X-Webhook-Secret')
            if auth_header != webhook_secret:
                print(f"Invalid webhook secret received")
                return jsonify({'success': False, 'error': 'Unauthorized'}), 401
        
        data = request.get_json(force=True)
        print(f"Parsed JSON: {json.dumps(data, indent=2)}")
        
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
        agent_type_raw = data.get('agent_type')
        run_number = data.get('run_number')
        status = data.get('status', 'success')
        message = data.get('message', '')
        workflow_data = data.get('data', {})
        
        if not all([user_id, agent_type_raw, run_number]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # Translate Make.com agent names to Rosie internal names
        # Make.com uses: agent_a, agent_b, etc. (hardcoded in HTTP modules)
        # Rosie uses: shortlist, intros, triage, etc. (from UI agent selection)
        agent_name_mapping = {
            'agent_a': 'shortlist',
            'agent_b': 'intros',
            'agent_c': 'triage',
            'agent_d': 'updates',
            'agent_e': 'sync',
            'agent_f': 'inventory'
        }
        
        agent_type = agent_name_mapping.get(agent_type_raw, agent_type_raw)
        
        # Log the callback for debugging
        print(f"Make.com callback: user={user_id}, agent={agent_type_raw} -> {agent_type}, run={run_number}, status={status}")
        print(f"Message: {message}")
        
        # Classify errors if status is not success
        error_category = None
        user_friendly_message = message
        
        if status != 'success':
            # Classify the error
            error_data = {
                'error_type': data.get('error_type', 'unknown'),
                'message': message
            }
            category, message_key, is_retryable = classify_error(error_data)
            error_category = category
            
            # Get user-friendly message
            error_detail = data.get('error_detail', message)
            field_name = data.get('field_name', 'a required field')
            email = data.get('email', '')
            run_id = data.get('run_id', '')
            
            user_friendly_message = get_user_friendly_error_message(
                category,
                message_key,
                error_detail=error_detail,
                field_name=field_name,
                email=email,
                run_id=run_id
            )
            
            print(f"Classified error: category={category}, message_key={message_key}, retryable={is_retryable}")
        
        # Update workflow run in database
        callback_data = {
            'message': message,
            'data': workflow_data,
            'error_category': error_category,
            'user_friendly_message': user_friendly_message
        }
        
        updated = update_workflow_run(
            user_id,
            agent_type,
            run_number,
            status,
            callback_data,
            user_friendly_message if status != 'success' else None,
            error_category
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
        user_friendly_message = None
        error_category = None
        
        if callback_data and isinstance(callback_data, dict):
            message = callback_data.get('message')
            user_friendly_message = callback_data.get('user_friendly_message')
            error_category = callback_data.get('error_category')
        
        # Return workflow status
        return jsonify({
            'success': True,
            'status': run_data.get('status'),
            'run_number': run_data.get('run_number'),
            'message': user_friendly_message or message,  # Use user-friendly message if available
            'error_message': run_data.get('error_message'),
            'error_category': error_category,
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
        
        # Auto-detect if web search is needed, or use manual override from checkbox
        auto_search_needed = should_use_web_search(user_message)
        use_search = enable_search or auto_search_needed
        
        # Fetch web data if needed
        web_context = None
        if use_search:
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
