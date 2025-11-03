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
- **Database**: PostgreSQL (Replit-hosted)
- **AI Provider**: Multi-provider LLM router (currently OpenAI gpt-4o-mini)
- **Authentication**: Session-based multi-user authentication with password hashing
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
├── llm_router.py          # Multi-provider LLM routing layer
├── db_helper.py           # Database operations (projects & conversations)
├── templates/
│   └── index.html         # Web chat interface with project management
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
  ],
  "provider": "openai",
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "max_tokens": 500
}
```

*Note: All parameters except `message` are optional. Defaults: provider=openai, model=gpt-4o-mini, temperature=0.7, max_tokens=500*

**Response:**
```json
{
  "success": true,
  "assistant": "Rosie",
  "message": "Rosie's response",
  "model": "gpt-4o-mini-2024-07-18",
  "provider": "openai",
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

### Project & Conversation Management Endpoints

**`GET /projects`** — List all project folders  
**`POST /projects`** — Create new project (body: `{"name": "Project Name"}`)  
**`POST /conversations`** — Save conversation (body: `{"project_id": 1, "title": "Title", "messages": [...]}`)  
**`GET /projects/{id}/conversations`** — List conversations in a project  
**`GET /conversations/{id}`** — Load a specific conversation  
**`DELETE /conversations/{id}`** — Delete a conversation

These endpoints power the web UI's ability to organize conversations into project folders (e.g., "Marketing Emails", "Customer Support", "Inventory Management") and save/load conversation history from PostgreSQL.

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
- `SESSION_SECRET` — Flask session secret for secure authentication (auto-generated if not provided)

### Database Schema
- **users** — name, email (unique), hashed_password, created_at
- **projects** — name, color, user_id (foreign key), created_at
- **conversations** — project_id (foreign key), title, messages (JSONB), user_id (foreign key), created_at, updated_at

All data is completely isolated by user_id for complete multi-tenant security.

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
- **Project folder & conversation management** (save/organize chats by project)
- **PostgreSQL database** for persistent conversation storage
- OpenAI API key securely stored
- Rosie's full persona implemented in system prompt
- CORS support for external integrations
- Session-based multi-user authentication
- **LIVE IN PRODUCTION** at **rosie.curlybraces.ai** 🎉
- Configured for autoscale deployment with custom domain

### 🔜 Next Steps
- Build first production endpoint (`/rosie-email` or `/rosie-triage`)
- Test POST integration from Make.com
- Add logging and version control for prompt iterations
- Consider migration to AWS/Render when stable

## Recent Changes

- **2025-11-03**: 🚀 **DEPLOYED TO PRODUCTION at rosie.curlybraces.ai**
  - Successfully linked custom domain via Replit Deployments → Domains tab
  - Added DNS A record: `rosie.curlybraces.ai` → Replit's IP
  - Added TXT record for domain verification
  - DNS propagated successfully - site is live!
  - Subtle logout button redesigned: transparent background, gray border, top-right corner
  - App is now accessible to beta testers at professional custom domain

- **2025-11-03**: Implemented complete multi-user authentication system
  - Replaced Basic HTTP Auth with session-based authentication
  - Created `users` table with secure password hashing (werkzeug)
  - Added `user_id` foreign keys to `projects` and `conversations` tables
  - Built login/signup page with CurlyBracesAI dark theme styling
  - Personalized greeting displays each user's name in header ("[Name]'s Agentic AI Automation")
  - Complete data isolation - users can only access their own projects and conversations
  - All CRUD operations verify user ownership before allowing access (prevents cross-tenant data leaks)
  - Added rename and delete functionality for conversations and projects
  - Added "Manage Projects" button (magenta) for project administration
  - Logout functionality included
  - Ready for beta testing with complete multi-tenant security

- **2025-11-03**: Implemented CurlyBracesAI brand theme and randomized project colors
  - Updated entire UI to dark theme matching CurlyBracesAI website
  - Cyan/blue brand color (#06b6d4) for primary elements and logo
  - Cyan-to-blue gradient on all buttons, matching website aesthetic
  - Added randomized color assignment for projects using full CurlyBracesAI palette:
    - Green (#10b981), Blue (#3b82f6), Purple (#8b5cf6), Orange (#f97316), Pink (#ec4899), Yellow (#eab308)
  - Each project gets a random color automatically on creation
  - Colored bullet indicators in project selector and conversation lists
  - Dark theme with black/dark gray backgrounds for professional look

- **2025-11-03**: Added project folder & conversation management
  - Created PostgreSQL database with `projects` and `conversations` tables
  - Implemented 6 new API endpoints for creating/saving/loading projects and conversations
  - Updated web UI with toolbar controls: project selector, save/load buttons, new chat
  - Added modal dialogs for creating projects, saving conversations, and loading conversations
  - All conversations are now persistent and organized by project folder
  - Database tables auto-initialize on startup
  - Production-ready with secure error handling and sanitized error messages

- **2025-11-03**: Implemented multi-provider LLM router
  - Created `llm_router.py` module for provider abstraction
  - Updated `/rosie-test` to accept optional `provider`, `model`, `temperature`, and `max_tokens` parameters
  - OpenAI is default provider (gpt-4o-mini)
  - Architecture ready for Anthropic (Claude) and Google (Gemini) integration
  - Future-proofed for easy provider switching without code changes

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
