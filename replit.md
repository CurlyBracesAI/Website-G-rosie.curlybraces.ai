# Rosie AI Agent — Modular Business Automation API

### Overview

Rosie is a modular AI automation engine designed to power multiple business workflows via a centralized API with a consistent persona and structured output. It aims to transition from Make.com into a stable Flask API layer, allowing flexible integration with various external platforms. Rosie centralizes AI reasoning, synthesis, and writing, ensuring structured output and a consistent personality across diverse applications like CRM email drafting, deal triage, inventory classification, and image metadata generation. The project envisions a future where Rosie streamlines complex business processes, offering a scalable and robust AI solution.

### User Preferences

Rosie is an AI assistant with a distinct personality:
- **Efficient & precise** — No fluff, no corporate speak
- **Dry & slightly sarcastic** — Impatient with ambiguity
- **Structured output** — Always returns clean, parseable data
- **Emotionally intelligent** — Drops sarcasm for sensitive topics (health, grief, legal, crisis)
- **Data-strict** — Never invents facts; flags missing information

The user wants the agent to:
- Be able to parse user intent from casual conversation to trigger workflows (e.g., "yes run flow 2", "let's do number 3").
- Provide escalating troubleshooting guidance based on consecutive timeout failures for workflows.
- Automatically prompt for the next run in multi-run workflows (e.g., "Ready for Run 2?").

### System Architecture

**Tech Stack**:
- **Backend**: Flask (Python)
- **Database**: PostgreSQL (Replit-hosted)
- **AI Provider**: Multi-provider LLM router (currently OpenAI gpt-4o-mini)
- **Authentication**: Session-based multi-user authentication with password hashing
- **Hosting**: Replit
- **CORS**: Flask-CORS for cross-origin requests

**Integration Flow**:
External systems (like Make.com/n8n) trigger the Rosie API, which processes requests and returns JSON responses. Rosie handles AI reasoning, structured output, and consistent persona, while external tools manage CRM authentication, scheduling, and data retrieval.

**Project Structure**:
The project is organized with `app.py` as the main Flask application, `llm_router.py` for LLM routing, `db_helper.py` for database operations, and a `templates` directory for the web chat interface.

**UI/UX Decisions**:
- Dark theme matching CurlyBracesAI brand with cyan/blue primary elements and gradient buttons.
- Randomized color assignment for projects (green, blue, purple, orange, pink, yellow).
- Interactive web UI with chat interface, real-time messaging, typing indicators, and auto-scroll.
- Mobile-friendly responsive design.
- User authentication includes customizable nicknames and personalized greetings.

**Technical Implementations**:
- **Multi-provider LLM router**: Abstracts LLM calls, currently using OpenAI, with future potential for Anthropic and Google.
- **Session-based multi-user authentication**: Securely manages user access with `users` table and password hashing, ensuring data isolation.
- **Project & Conversation Management**: Utilizes PostgreSQL for persistent storage of project folders and conversation histories, accessible via dedicated API endpoints.
- **Live Web Search**: Integration with Serper.dev API for real-time web data retrieval, controlled by a user-toggle.
- **Make.com Agent Mode Connectors**: Six specialized workflow agents with dedicated system prompts for tasks like client shortlisting, intros, daily triage, etc.
- **Workflow Tracking**: `workflow_runs` table in PostgreSQL tracks the status of Make.com workflow executions (pending, success, failed) with secure callback authentication.
- **Intelligent Conversation & Escalating Error Detection**: Rosie can parse natural language for workflow triggers and provides tailored troubleshooting advice for consecutive timeout failures.

**Feature Specifications**:
- **`GET /`**: Interactive Web UI for testing and project management.
- **`POST /rosie-test`**: General chat endpoint with optional `provider`, `model`, `temperature`, and `max_tokens`.
- **`GET /health`**: Health check endpoint.
- **Project & Conversation Management Endpoints**: `GET /projects`, `POST /projects`, `POST /conversations`, `GET /projects/{id}/conversations`, `GET /conversations/{id}`, `DELETE /conversations/{id}`.
- **Planned Production Endpoints**: Specialized endpoints like `/rosie-email`, `/rosie-triage`, `/rosie-inventory`, `/rosie-images` for specific business automation tasks, each with specialized system prompts and structured JSON input/output.
- **Make.com Integration Endpoints**:
    - `POST /api/make-callback`: Receives workflow completion callbacks from Make.com with `X-Webhook-Secret` authentication.
    - `POST /api/trigger-workflow`: Triggers Make.com workflows for active agents.
    - `GET /api/poll-workflow-status`: Checks the latest workflow run status.
- **Multi-Run Workflow Logic**: Supports sequential runs for agents (e.g., Agent A: 3 runs, Agent B: 2 runs), requiring user confirmation between runs.

### External Dependencies

- **OpenAI**: Primary LLM provider (`gpt-4o-mini`).
- **PostgreSQL**: Database for storing user, project, conversation, and workflow run data.
- **Make.com**: Workflow automation platform for triggering and receiving callbacks.
- **n8n**: Workflow automation platform (supported integration).
- **Pipedrive**: CRM (supported integration).
- **Serper.dev API**: For live web search capabilities.
- **Flask-CORS**: For handling Cross-Origin Resource Sharing.
- **Werkzeug**: For secure password hashing in authentication.