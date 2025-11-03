# Rosie AI Assistant API

## Overview
A Flask-based REST API that provides access to Rosie, a custom AI assistant powered by OpenAI's GPT models. The API accepts JSON input via POST requests and returns structured JSON responses.

## Purpose
This project creates a simple, clean API endpoint for interacting with a custom AI assistant named Rosie. Rosie is configured with a specific persona to be helpful, friendly, and professional.

## Architecture

### Tech Stack
- **Backend Framework**: Flask 3.1.2
- **AI Provider**: OpenAI API (gpt-4o-mini)
- **CORS**: Flask-CORS for cross-origin requests
- **Environment Management**: python-dotenv

### Project Structure
```
.
├── app.py              # Main Flask application
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore rules
├── pyproject.toml      # Python dependencies
└── replit.md           # Project documentation
```

## Current Features
- **POST /rosie-test**: Main endpoint for interacting with Rosie
  - Accepts JSON with a "message" field (required)
  - Accepts optional "history" array to maintain conversation context
  - Returns structured JSON with assistant's response
  - Includes token usage information
  
- **GET /health**: Health check endpoint
  - Returns API status and version

## Usage Examples

### Simple Message (No History)
```json
POST /rosie-test
{
  "message": "Hello Rosie, how are you?"
}
```

### Message with Conversation History
```json
POST /rosie-test
{
  "message": "What is my name?",
  "history": [
    {"role": "user", "content": "My name is Alice."},
    {"role": "assistant", "content": "Hi Alice! It's great to meet you."}
  ]
}
```

### Response Format
```json
{
  "success": true,
  "assistant": "Rosie",
  "message": "Your name is Alice. How can I help you today?",
  "model": "gpt-4o-mini-2024-07-18",
  "usage": {
    "prompt_tokens": 85,
    "completion_tokens": 15,
    "total_tokens": 100
  }
}
```

## Configuration
Requires `OPENAI_API_KEY` environment variable to be set.

## Recent Changes
- 2025-11-03: Added conversation history support
  - Updated /rosie-test endpoint to accept optional "history" array
  - Added validation for history format
  - Rosie now maintains context across multiple exchanges
  
- 2025-11-03: Initial project setup
  - Created Flask API with OpenAI integration
  - Implemented /rosie-test endpoint with custom Rosie persona
  - Added CORS support and error handling
  - Configured project structure and dependencies
