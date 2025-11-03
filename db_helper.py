import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import random

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
            cur.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    color VARCHAR(7) DEFAULT '#06b6d4',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE TABLE IF NOT EXISTS conversations (
                    id SERIAL PRIMARY KEY,
                    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                    title VARCHAR(255) NOT NULL,
                    messages JSONB NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                CREATE INDEX IF NOT EXISTS idx_conversations_project_id 
                ON conversations(project_id);
            """)
            conn.commit()
    finally:
        conn.close()

def create_project(name):
    """Create a new project folder with a random color from the CurlyBracesAI palette."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Assign a random color from the palette
            color = random.choice(PROJECT_COLORS)
            cur.execute(
                "INSERT INTO projects (name, color) VALUES (%s, %s) RETURNING id, name, color, created_at",
                (name, color)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result)
    finally:
        conn.close()

def get_all_projects():
    """Get all project folders with their assigned colors."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, color, created_at FROM projects ORDER BY name"
            )
            results = cur.fetchall()
            return [dict(row) for row in results]
    finally:
        conn.close()

def save_conversation(project_id, title, messages):
    """Save a conversation to a project."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO conversations (project_id, title, messages, updated_at)
                   VALUES (%s, %s, %s, CURRENT_TIMESTAMP)
                   RETURNING id, project_id, title, created_at, updated_at""",
                (project_id, title, json.dumps(messages))
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result)
    finally:
        conn.close()

def get_conversations_by_project(project_id):
    """Get all conversations for a specific project."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, project_id, title, created_at, updated_at
                   FROM conversations
                   WHERE project_id = %s
                   ORDER BY updated_at DESC""",
                (project_id,)
            )
            results = cur.fetchall()
            return [dict(row) for row in results]
    finally:
        conn.close()

def load_conversation(conversation_id):
    """Load a specific conversation with its messages."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """SELECT id, project_id, title, messages, created_at, updated_at
                   FROM conversations
                   WHERE id = %s""",
                (conversation_id,)
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

def delete_conversation(conversation_id):
    """Delete a conversation."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM conversations WHERE id = %s",
                (conversation_id,)
            )
            conn.commit()
            return True
    finally:
        conn.close()

def update_conversation_title(conversation_id, new_title):
    """Update a conversation's title."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE conversations SET title = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING id, title",
                (new_title, conversation_id)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result) if result else None
    finally:
        conn.close()

def update_project_name(project_id, new_name):
    """Update a project's name."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE projects SET name = %s WHERE id = %s RETURNING id, name, color",
                (new_name, project_id)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result) if result else None
    finally:
        conn.close()

def delete_project(project_id):
    """Delete a project and all its conversations (cascade)."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Check if project exists
            cur.execute("SELECT id FROM projects WHERE id = %s", (project_id,))
            if not cur.fetchone():
                return None
            
            # Check how many conversations will be deleted
            cur.execute("SELECT COUNT(*) FROM conversations WHERE project_id = %s", (project_id,))
            count = cur.fetchone()[0]
            
            # Delete the project (conversations will cascade delete)
            cur.execute("DELETE FROM projects WHERE id = %s", (project_id,))
            conn.commit()
            return {'deleted_conversations': count}
    finally:
        conn.close()
