import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import random
from werkzeug.security import generate_password_hash, check_password_hash

# CurlyBracesAI color palette - subtle panel colors from website
PROJECT_COLORS = [
    '#2d5f5f',  # Dark teal - Agent A panel
    '#2d4f6f',  # Dark blue - Agent B panel
    '#4a3a5f',  # Dark purple - Agent C panel
    '#6f5030',  # Dark brown/orange - Agent D panel
    '#6f3050',  # Dark magenta - Agent E panel
    '#6f5f20',  # Dark olive/golden - Agent F panel
]

def get_db_connection():
    """Get a connection to the PostgreSQL database."""
    return psycopg2.connect(
        os.getenv('DATABASE_URL'),
        cursor_factory=RealDictCursor
    )

def initialize_database():
    """Initialize database tables if they don't exist."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Create users table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    nickname VARCHAR(100) DEFAULT 'knucklehead',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Add nickname column to existing users table (migration)
            cur.execute("""
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'users' AND column_name = 'nickname'
                    ) THEN
                        ALTER TABLE users ADD COLUMN nickname VARCHAR(100) DEFAULT 'knucklehead';
                    END IF;
                END $$;
            """)
            
            # Create projects table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(255) NOT NULL,
                    color VARCHAR(7) DEFAULT '#06b6d4',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Create conversations table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id SERIAL PRIMARY KEY,
                    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    messages JSONB NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            # Create workflow_runs table for Make.com integration
            cur.execute("""
                CREATE TABLE IF NOT EXISTS workflow_runs (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    agent_type VARCHAR(50) NOT NULL,
                    run_number INTEGER NOT NULL,
                    status VARCHAR(50) DEFAULT 'pending',
                    trigger_data JSONB,
                    callback_data JSONB,
                    error_message TEXT,
                    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    completed_at TIMESTAMP,
                    UNIQUE(user_id, agent_type, run_number, triggered_at)
                );
            """)
            
            # Add indexes
            cur.execute("""
                CREATE INDEX IF NOT EXISTS idx_conversations_project_id 
                ON conversations(project_id);
                
                CREATE INDEX IF NOT EXISTS idx_conversations_user_id 
                ON conversations(user_id);
                
                CREATE INDEX IF NOT EXISTS idx_projects_user_id 
                ON projects(user_id);
            """)
            
            # Add user_id columns if they don't exist (migration for existing data)
            cur.execute("""
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name='projects' AND column_name='user_id'
                    ) THEN
                        ALTER TABLE projects ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
                    END IF;
                END $$;
            """)
            
            cur.execute("""
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns 
                        WHERE table_name='conversations' AND column_name='user_id'
                    ) THEN
                        ALTER TABLE conversations ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
                    END IF;
                END $$;
            """)
            
            conn.commit()
    finally:
        conn.close()

def create_project(name, user_id):
    """Create a new project folder with a random color from the CurlyBracesAI palette."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Assign a random color from the palette
            color = random.choice(PROJECT_COLORS)
            cur.execute(
                "INSERT INTO projects (name, color, user_id) VALUES (%s, %s, %s) RETURNING id, name, color, created_at",
                (name, color, user_id)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result)
    finally:
        conn.close()

def get_all_projects(user_id):
    """Get all project folders for a specific user with their assigned colors."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, color, created_at FROM projects WHERE user_id = %s ORDER BY name",
                (user_id,)
            )
            results = cur.fetchall()
            return [dict(row) for row in results]
    finally:
        conn.close()

def save_conversation(project_id, title, messages, user_id):
    """Save a conversation to a project (only if project belongs to user)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Verify project belongs to user before allowing save
            cur.execute(
                "SELECT id FROM projects WHERE id = %s AND user_id = %s",
                (project_id, user_id)
            )
            if not cur.fetchone():
                return None  # Project doesn't exist or doesn't belong to user
            
            # Save the conversation
            cur.execute(
                """INSERT INTO conversations (project_id, title, messages, user_id, updated_at)
                   VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                   RETURNING id, project_id, title, created_at, updated_at""",
                (project_id, title, json.dumps(messages), user_id)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result)
    finally:
        conn.close()

def get_conversations_by_project(project_id, user_id):
    """Get all conversations for a specific project (filtered by user)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, project_id, title, created_at, updated_at
                   FROM conversations
                   WHERE project_id = %s AND user_id = %s
                   ORDER BY updated_at DESC""",
                (project_id, user_id)
            )
            results = cur.fetchall()
            return [dict(row) for row in results]
    finally:
        conn.close()

def load_conversation(conversation_id, user_id):
    """Load a specific conversation with its messages (filtered by user for security)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, project_id, title, messages, created_at, updated_at
                   FROM conversations
                   WHERE id = %s AND user_id = %s""",
                (conversation_id, user_id)
            )
            result = cur.fetchone()
            if result:
                conversation = dict(result)
                # RealDictCursor automatically deserializes JSONB, no need to parse again
                # conversation['messages'] is already a list
                return conversation
            return None
    finally:
        conn.close()

def delete_conversation(conversation_id, user_id):
    """Delete a conversation (only if owned by user)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Check if conversation exists and belongs to user
            cur.execute(
                "SELECT id FROM conversations WHERE id = %s AND user_id = %s",
                (conversation_id, user_id)
            )
            if not cur.fetchone():
                return False
            
            # Delete the conversation
            cur.execute(
                "DELETE FROM conversations WHERE id = %s AND user_id = %s",
                (conversation_id, user_id)
            )
            conn.commit()
            return True
    finally:
        conn.close()

def update_conversation_title(conversation_id, new_title, user_id):
    """Update a conversation's title (only if owned by user)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE conversations SET title = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s AND user_id = %s RETURNING id, title",
                (new_title, conversation_id, user_id)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result) if result else None
    finally:
        conn.close()

def update_project_name(project_id, new_name, user_id):
    """Update a project's name (only if owned by user)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE projects SET name = %s WHERE id = %s AND user_id = %s RETURNING id, name, color",
                (new_name, project_id, user_id)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result) if result else None
    finally:
        conn.close()

def delete_project(project_id, user_id):
    """Delete a project and all its conversations (only if owned by user)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Check if project exists and belongs to user
            cur.execute("SELECT id FROM projects WHERE id = %s AND user_id = %s", (project_id, user_id))
            if not cur.fetchone():
                return None
            
            # Check how many conversations will be deleted (use column alias for RealDictCursor)
            cur.execute("SELECT COUNT(*) as count FROM conversations WHERE project_id = %s AND user_id = %s", (project_id, user_id))
            result = cur.fetchone()
            count = result['count'] if result else 0
            
            # Delete the project (conversations will cascade delete)
            cur.execute("DELETE FROM projects WHERE id = %s AND user_id = %s", (project_id, user_id))
            conn.commit()
            return {'deleted_conversations': count}
    finally:
        conn.close()

# User authentication functions

def create_user(name, email, password, nickname='knucklehead'):
    """Create a new user account."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            password_hash = generate_password_hash(password)
            cur.execute(
                "INSERT INTO users (name, email, password_hash, nickname) VALUES (%s, %s, %s, %s) RETURNING id, name, email, nickname, created_at",
                (name, email, password_hash, nickname)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result) if result else None
    except psycopg2.IntegrityError:
        # Email already exists
        return None
    finally:
        conn.close()

def authenticate_user(email, password):
    """Authenticate a user by email and password."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, email, nickname, password_hash FROM users WHERE email = %s",
                (email,)
            )
            user = cur.fetchone()
            if user and check_password_hash(user['password_hash'], password):
                # Return user without password_hash
                return {'id': user['id'], 'name': user['name'], 'email': user['email'], 'nickname': user.get('nickname', 'knucklehead')}
            return None
    finally:
        conn.close()

def get_user_by_id(user_id):
    """Get user by ID."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, email, nickname FROM users WHERE id = %s",
                (user_id,)
            )
            user = cur.fetchone()
            return dict(user) if user else None
    finally:
        conn.close()

# Workflow run management functions

def create_workflow_run(user_id, agent_type, run_number, trigger_data=None):
    """Create a new workflow run record when triggering Make.com."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO workflow_runs 
                (user_id, agent_type, run_number, status, trigger_data)
                VALUES (%s, %s, %s, 'pending', %s)
                RETURNING id
            """, (user_id, agent_type, run_number, json.dumps(trigger_data) if trigger_data else None))
            result = cur.fetchone()
            conn.commit()
            return result['id'] if result else None
    finally:
        conn.close()

def update_workflow_run(user_id, agent_type, run_number, status, callback_data=None, error_message=None):
    """Update workflow run status when receiving callback from Make.com."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE workflow_runs 
                SET status = %s,
                    callback_data = %s,
                    error_message = %s,
                    completed_at = CURRENT_TIMESTAMP
                WHERE user_id = %s 
                AND agent_type = %s 
                AND run_number = %s
                AND status = 'pending'
                ORDER BY triggered_at DESC
                LIMIT 1
            """, (
                status, 
                json.dumps(callback_data) if callback_data else None,
                error_message,
                user_id, 
                agent_type, 
                run_number
            ))
            conn.commit()
            return cur.rowcount > 0
    finally:
        conn.close()

def get_latest_workflow_run(user_id, agent_type):
    """Get the most recent workflow run for a user and agent."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, agent_type, run_number, status, 
                       callback_data, error_message, 
                       triggered_at, completed_at
                FROM workflow_runs
                WHERE user_id = %s AND agent_type = %s
                ORDER BY triggered_at DESC
                LIMIT 1
            """, (user_id, agent_type))
            return cur.fetchone()
    finally:
        conn.close()

def get_workflow_run_by_number(user_id, agent_type, run_number):
    """Get a specific workflow run by number."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, agent_type, run_number, status, 
                       callback_data, error_message, 
                       triggered_at, completed_at
                FROM workflow_runs
                WHERE user_id = %s 
                AND agent_type = %s 
                AND run_number = %s
                ORDER BY triggered_at DESC
                LIMIT 1
            """, (user_id, agent_type, run_number))
            return cur.fetchone()
    finally:
        conn.close()

def get_next_run_number(user_id, agent_type):
    """Get the next run number for this agent (based on completed runs)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT COALESCE(MAX(run_number), 0) + 1 as next_run
                FROM workflow_runs
                WHERE user_id = %s 
                AND agent_type = %s
                AND status = 'success'
            """, (user_id, agent_type))
            result = cur.fetchone()
            return result['next_run'] if result else 1
    finally:
        conn.close()
