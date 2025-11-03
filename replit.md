# Rosie AI Agent — Modular Business Automation API

## Purpose

Rosie is a **modular AI automation engine** designed to power multiple business workflows via a centralized API with a consistent persona and structured output. Use cases include:

- CRM email drafting
- Deal triage and summarization
- Inventory and contact classification
- Image metadata generation

Rosie is transitioning from Make.com into a stable Flask API layer, allowing flexible integration with Make.com, n8n, Pipedrive, or future client applications.

## Why Flask?

- **Centralizes Rosie's logic** outside workflow automation tools
- Allows multiple specialized "agent endpoints" (e.g., `/rosie-email`, `/rosie-triage`, `/rosie-inventory`)
- Compatible with Make.com, n8n, Zapier, Pipedrive, Gmail, AWS, and other services
- Provides a stable API contract for external integrations

## Why Replit?

- Instant hosting and preview
- Fast iteration and tinkering
- Easy secret management
- Can deploy elsewhere when ready (AWS, Render, Vercel, etc.)

## Architecture

### Tech Stack
- **Backend**: Flask 3.1.2 (Python)
- **AI Provider**: OpenAI API (gpt-4o-mini)
- **Authentication**: Basic HTTP Authentication (Flask-HTTPAuth)
- **Hosting**: Replit
- **CORS**: Flask-CORS for cross-origin requests
- **Secrets**: Replit environment variables

### Integration Flow

```
[External System] → [Make.com/n8n] → [Rosie API] → [JSON Response] → [Make.com/n8n] → [Update CRM/Send Email]
```

**External tools handle:**
- Authentication to CRMs and APIs
- Scheduling and triggers
- Data retrieval and storage

**Rosie handles:**
- AI reasoning, synthesis, and writing
- Structured output formatting
- Consistent personality and tone

### Project Structure
```
.
├── app.py                  # Main Flask application
├── templates/
│   └── index.html         # Web chat interface
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore rules
├── pyproject.toml         # Python dependencies
└── replit.md              # This documentation
```

## Rosie's Persona

Rosie is an AI assistant with a distinct personality:

- **Efficient & precise** — No fluff, no corporate speak
- **Dry & slightly sarcastic** — Impatient with ambiguity
- **Structured output** — Always returns clean, parseable data
- **Emotionally intelligent** — Drops sarcasm for sensitive topics (health, grief, legal, crisis)
- **Data-strict** — Never invents facts; flags missing information

This persona is optimized for business automation and CRM workflows.

## Current Endpoints

### `GET /`
**Interactive Web UI**
- Beautiful chat interface for testing Rosie
- Real-time messaging with typing indicators
- Automatic conversation history tracking
- Mobile-friendly responsive design

### `POST /rosie-test`
**General chat endpoint for testing**

**Request:**
```json
{
  "message": "Your question here",
  "history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "assistant": "Rosie",
  "message": "Rosie's response",
  "model": "gpt-4o-mini-2024-07-18",
  "usage": {
    "prompt_tokens": 85,
    "completion_tokens": 15,
    "total_tokens": 100
  }
}
```

### `GET /health`
**Health check endpoint**

**Response:**
```json
{
  "status": "healthy",
  "assistant": "Rosie",
  "version": "1.0.0"
}
```

## Planned Production Endpoints

These specialized endpoints will be added for specific business automation tasks:

| Endpoint | Purpose |
|----------|---------|
| `/rosie-email` | Draft partner or client emails from CRM data |
| `/rosie-triage` | Analyze deal notes/activities and generate summary |
| `/rosie-inventory` | Classify scraped building contacts (owner vs sublessee) |
| `/rosie-images` | Generate alt/tooltip text from S3 image URLs via Rekognition + OpenAI |

Each endpoint will:
- Have a specialized system prompt
- Accept structured JSON input
- Return structured JSON output (for easy Make.com/n8n mapping)
- Include validation and error handling

## Configuration

### Required Environment Variables
- `OPENAI_API_KEY` — Your OpenAI API key (stored in Replit Secrets)
- `AUTH_USERNAME` — Username for Basic HTTP Authentication
- `AUTH_PASSWORD` — Password for Basic HTTP Authentication

### Optional Environment Variables
- `SESSION_SECRET` — Flask session secret (auto-generated if not provided)

## Integration Examples

### Make.com HTTP Module
```
1. HTTP Request → POST to https://your-repl.replit.app/rosie-email
2. Body: JSON with CRM data
3. Parse JSON response
4. Map fields back to Pipedrive/Gmail
```

### n8n Workflow
```
1. Webhook/Trigger
2. HTTP Request node → Rosie API
3. Set/Map node → Parse response
4. Update CRM or send notification
```

## Development Status

### ✅ Completed
- Flask app scaffolded and deployed on Replit
- `/rosie-test` endpoint working with conversation history
- Web chat UI for interactive testing
- OpenAI API key securely stored
- Rosie's full persona implemented in system prompt
- CORS support for external integrations
- Basic HTTP Authentication protecting all endpoints
- Configured for autoscale deployment (ready to publish)

### 🔜 Next Steps
- Build first production endpoint (`/rosie-email` or `/rosie-triage`)
- Test POST integration from Make.com
- Add logging and version control for prompt iterations
- Consider migration to AWS/Render when stable

## Recent Changes

- **2025-11-03**: Added Basic HTTP Authentication
  - Installed flask-httpauth package
  - Protected all endpoints (/, /rosie-test, /health) with username/password authentication
  - Credentials stored securely in Replit Secrets (AUTH_USERNAME, AUTH_PASSWORD)
  - Configured for secure production deployment with HTTPS

- **2025-11-03**: Added comprehensive project documentation
  - Documented full vision and architecture
  - Listed planned production endpoints
  - Added integration examples for Make.com and n8n

- **2025-11-03**: Updated Rosie's personality
  - Changed from friendly/warm to dry, efficient, and slightly sarcastic
  - Optimized for business automation use cases
  - Maintains empathy for sensitive topics (health, grief, legal, crisis)
  - Strict about data accuracy and formatting requirements

- **2025-11-03**: Added interactive web UI
  - Created beautiful chat interface with gradient design
  - Implemented real-time messaging with typing indicators
  - Added automatic conversation history tracking
  - Integrated Enter key support and auto-scroll

- **2025-11-03**: Added conversation history support
  - Updated `/rosie-test` endpoint to accept optional "history" array
  - Added validation for history format
  - Rosie maintains context across multiple exchanges
  
- **2025-11-03**: Initial project setup
  - Created Flask API with OpenAI integration
  - Implemented `/rosie-test` endpoint with custom Rosie persona
  - Added CORS support and error handling
  - Configured project structure and dependencies
