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

### How to Manage Secrets in Replit

**IMPORTANT:** Secrets are NOT in the left sidebar or Tools menu!

**Location:** Click your **profile icon** (top right) → **Account** → **Account Secrets**

Or navigate directly to: `https://replit.com/account#account-secrets`

From there you can:
- View all account-level secrets (values are hidden/encrypted)
- Add new secrets with the **+ New secret** button
- Edit or delete existing secrets

These secrets are automatically available as environment variables in all your Replit apps.

### Required Environment Variables
- `OPENAI_API_KEY` — Your OpenAI API key (stored in Replit Secrets)
- `SESSION_SECRET` — Flask session secret for secure authentication (auto-generated if not provided)
- `SERPER_API_KEY` — Serper.dev API key for live web search (optional, enables web search feature)
- `MAKE_WEBHOOK_SECRET` — Webhook authentication secret for Make.com callbacks (required for production)
- `MAKE_WEBHOOK_AGENT_A` through `MAKE_WEBHOOK_AGENT_F` — Make.com webhook URLs for each agent (to be configured)

### Database Schema
- **users** — name, email (unique), hashed_password, created_at
- **projects** — name, color, user_id (foreign key), created_at
- **conversations** — project_id (foreign key), title, messages (JSONB), user_id (foreign key), created_at, updated_at
- **workflow_runs** — user_id (foreign key), agent_type, run_number, status, trigger_data (JSONB), callback_data (JSONB), error_message, triggered_at, completed_at

All data is completely isolated by user_id for complete multi-tenant security.

### Workflow Run Tracking
The `workflow_runs` table tracks all Make.com workflow executions:
- **Pending** — Workflow triggered, waiting for Make.com callback
- **Success** — Make.com confirmed successful completion
- **Failed** — Make.com reported error or workflow failed
- Run counter only increments after successful callback (prevents skipped runs)
- Frontend polls `/api/poll-workflow-status` every 5 seconds to check completion
- Supports multi-run workflows (Agent A: 3 runs, Agent B: 2 runs)

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
- **Live web search capability** via Serper.dev API (optional, user-controlled)
- **Make.com Agent Mode connectors** — 6 specialized workflow agents with custom system prompts
- Web chat UI for interactive testing with markdown formatting support
- **Project folder & conversation management** (save/organize chats by project)
- **PostgreSQL database** for persistent conversation storage
- OpenAI API key securely stored
- Rosie's full persona implemented in system prompt
- CORS support for external integrations
- Session-based multi-user authentication with customizable nicknames
- **LIVE IN PRODUCTION** at **rosie.curlybraces.ai** 🎉
- Configured for autoscale deployment with custom domain

### 🔜 Next Steps
- Build first production endpoint (`/rosie-email` or `/rosie-triage`)
- Test POST integration from Make.com
- Add logging and version control for prompt iterations
- Consider migration to AWS/Render when stable

## Make.com Integration

### Webhook Authentication
All Make.com callbacks must include the `X-Webhook-Secret` header with the configured secret for security.

### Callback Endpoint: `/api/make-callback`
**POST /api/make-callback** — Receives workflow completion callbacks from Make.com

**Required Headers:**
```
X-Webhook-Secret: <MAKE_WEBHOOK_SECRET value>
Content-Type: application/json
```

**Expected Payload:**
```json
{
  "user_id": 123,
  "agent_type": "shortlist",
  "run_number": 1,
  "status": "success",
  "message": "Run 1 completed - client logged and proposal generated",
  "data": {
    "optional": "workflow results"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Callback processed",
  "agent_type": "shortlist",
  "run_number": 1,
  "status": "success"
}
```

### Workflow Trigger Endpoint: `/api/trigger-workflow`
**POST /api/trigger-workflow** — Triggers Make.com workflow for active agent

**Request:**
```json
{
  "conversation_context": [
    {"role": "user", "content": "Recent message 1"},
    {"role": "assistant", "content": "Recent response 1"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow triggered - waiting for completion",
  "run_number": 1,
  "run_id": 42,
  "max_runs": 3
}
```

### Polling Endpoint: `/api/poll-workflow-status`
**GET /api/poll-workflow-status** — Check latest workflow run status

**Response:**
```json
{
  "success": true,
  "status": "success",
  "run_number": 1,
  "message": "Run 1 completed successfully",
  "error_message": null,
  "completed_at": "2025-11-04T12:34:56"
}
```

### Multi-Run Workflow Logic
- **Agent A (Shortlist)**: 3 sequential runs with user confirmation between each
  - Run 1: Login client, generate speculative report
  - Run 2: Full detailed report (if qualified)
  - Run 3: Follow-up with alternatives
- **Agent B (Intros & Tours)**: 2 sequential runs
  - Run 1: Initial outreach
  - Run 2: Follow-up sequence
- **Agents C-F**: Single-run workflows

Frontend automatically prompts user: "Ready for Run 2?" after successful completion.

## Recent Changes

- **2025-11-07**: 🧠 **Intelligent Conversation & Escalating Error Detection**
  - **Natural language workflow triggering** — Rosie now parses user intent from casual conversation
    - User can say "yes run flow 2", "let's do number 3", "go with run 1" instead of just typing numbers
    - AI extracts run number using `[TRIGGER_FLOW:N]` marker syntax and auto-triggers workflow
    - No more rigid command requirements - flexible, conversational interaction
  - **Fixed agent prompts** — Changed from prescriptive to descriptive
    - Agent prompts now explain what the agent DOES (e.g., "creates shortlist proposals from CRM data")
    - Removed prescriptive instructions that forced Rosie to ask questions before triggering workflows
    - Users can now immediately trigger workflows without Rosie asking for information first
  - **Escalating troubleshooting guidance** — Rosie tracks consecutive timeout failures and provides targeted help:
    - **1st timeout:** "Check that deal is in the correct trigger stage in Pipedrive"
    - **2nd timeout:** "Check that AI confirmation flow stages are NOT marked 'Yes' (should be blank or 'No')"
    - **3rd+ timeout:** General troubleshooting with note that individual module failures are normal
    - Failure counter resets on successful workflow completion
    - Addresses the two most common failure modes in order of likelihood
  - **Make.com error handling optimization** — Documented "Ignore" error handler setup to prevent queue blocking
    - Error runs now auto-clear instead of requiring manual intervention
    - "Run Immediately" button stays enabled even after errors
    - Individual module failures (missing phone numbers, etc.) won't block scenario - just skip that step
    - Recommended configuration: Disable incomplete executions, disable sequential processing, increase max consecutive errors

- **2025-11-06**: 🎯 **Agent A Fully Operational - Complete End-to-End Integration**
  - **Agent A (Shortlist) successfully tested** with all 3 sequential runs working perfectly
  - Complete workflow tested: User triggers → Make.com Bridge → Workflow scenario → HTTP callback → Database update → UI notification
  - Bridge scenario optimized: removed redundant HTTP callback module (only workflow scenario sends callbacks)
  - Agent name translation working: Make.com sends "agent_a" → Rosie translates to "shortlist" for database lookup
  - Workflow completion time: ~17 seconds from trigger to callback
  - Each run requires user confirmation ("yes") before progressing to next run
  - Database correctly tracks pending → success status transitions
  - Frontend polling updates UI in real-time with workflow completion messages
  - **GitHub version control connected** - project repository linked for backup and collaboration
  - **Agents B-F ready for deployment** - all code configured, awaiting webhook URL secrets:
    - Agent B (Intros): 2 runs, needs MAKE_WEBHOOK_AGENT_B
    - Agent C (Triage): 1 run, needs MAKE_WEBHOOK_AGENT_C
    - Agent D (Updates): 1 run, needs MAKE_WEBHOOK_AGENT_D
    - Agent E (Sync): 1 run, needs MAKE_WEBHOOK_AGENT_E
    - Agent F (Inventory): 1 run, needs MAKE_WEBHOOK_AGENT_F
  - All Make.com scenarios engineered and ready for webhook configuration
  - Production-ready multi-agent automation platform fully operational

- **2025-11-05**: 🔐 **Production-Ready Make.com Webhook Integration**
  - Added `workflow_runs` database table to track all workflow executions
  - Implemented secure callback endpoint `/api/make-callback` with `X-Webhook-Secret` authentication
  - Run counter now increments only after Make.com confirms success (prevents skipped runs)
  - Added `/api/poll-workflow-status` endpoint for frontend to check workflow completion
  - Implemented frontend polling (every 5 seconds) to display workflow results in chat
  - Automatic run progression prompts: "Ready for Run 2?" after successful completion
  - Database functions: `create_workflow_run`, `update_workflow_run`, `get_latest_workflow_run`, `get_next_run_number`
  - Multi-run workflows fully supported (Agent A: 3 runs, Agent B: 2 runs)
  - User must confirm between each sequential run before progressing
  - Frontend displays success/error messages with workflow data from Make.com
  - Complete audit trail of all workflow triggers and callbacks in PostgreSQL

- **2025-11-04**: 🤖 **Added Make.com Agent Mode Connectors**
  - Implemented 6 specialized agent modes with dedicated system prompts
  - Agent types: Client Shortlist, Intros & Tours, Daily Triage, Partner Updates, Sync Updater, Building Inventory
  - Color-coded buttons matching CurlyBracesAI palette (purple, green, blue, orange, yellow, gray)
  - Agent buttons display two-line labels: bold workflow title + regular "Agent A/B/C/D/E/F" designation
  - Agent selection persists in session across page reloads
  - Each agent has specialized instructions for structured workflow output
  - API endpoints: `/api/set-agent` (POST) and `/api/get-agent` (GET)
  - When agent is selected, system prompt combines base Rosie personality with agent-specific context
  - UI updates dynamically to show active agent with confirmation message
  - Agent confirmation messages instruct user to verify CRM trigger stage placement
  - **Auto-reply for workflow confirmations** — When user confirms (yes/ready/confirmed/etc.), Rosie automatically responds: "Great, I'm running the flow, I'll place the report in the CRM client deal, along with the draft SMS and emails."
  - Responsive button layout wraps dynamically based on screen width
  - Designed for Make.com webhook integrations and automated workflow triggers

- **2025-11-04**: 🌐 **Added Live Web Search Capability**
  - Integrated Serper.dev API for real-time web data retrieval
  - Added user-controlled checkbox toggle (🌐 Enable live web search) in chat UI
  - Rosie can now fetch current information (news, prices, events) when search is enabled
  - Cost-efficient: only searches when explicitly enabled by user
  - Fetches top 5 web results and injects context into LLM prompt
  - Graceful error handling - continues normally if search fails
  - Free tier: 2,500 searches, then $1/1K searches (10x cheaper than alternatives)
  - Enhanced markdown rendering: **bold**, headers (###), proper line breaks

- **2025-11-04**: 🎨 **UI Refinements and Personalization**
  - Changed greeting from "Oi" to "Hey" with first name instead of last name
  - Updated message to "How can I help you" (friendlier tone)
  - Converted nickname field to dropdown with 18 fun options (Knucklehead, Boss, Gorgeous Creature, etc.)
  - Styled dropdown to match form inputs (white text on black background)
  - Matched input box border to main container (green pinstripe #2a4f4f)
  - Redesigned logout button: subtle gray transparent, top-right corner positioning

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
