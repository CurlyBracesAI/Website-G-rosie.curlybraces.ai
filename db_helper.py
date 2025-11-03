import os
import psycopg2
from psycopg2.extras import RealDictCursor
import json

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
    """Create a new project folder."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO projects (name) VALUES (%s) RETURNING id, name, created_at",
                (name,)
            )
            result = cur.fetchone()
            conn.commit()
            return dict(result)
    finally:
        conn.close()

def get_all_projects():
    """Get all project folders."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, created_at FROM projects ORDER BY name"
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
                conversation['messages'] = json.loads(conversation['messages'])
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
