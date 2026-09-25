# Contributing Guide — Team Ace of Spades

## Welcome, teammate! 👋

This guide tells you how to work on IndustrySphere AI without stepping on each other's toes.

---

## Branch Strategy

```
main              ← production-ready code only (don't push directly)
  └── develop     ← integration branch (merge your features here)
        ├── feat/frontend-dashboard      (UI/UX developer)
        ├── feat/backend-api             (Backend engineer)
        ├── feat/ml-models               (Data scientist)
        ├── feat/mcp-servers             (Backend engineer)
        └── feat/scraper-pipeline        (Backend engineer)
```

**Rule:** Never push directly to `main`. Always open a Pull Request from `develop` → `main`.

---

## Who Owns What

| Directory | Owner | What's Inside |
|-----------|-------|---------------|
| `frontend/` | UI/UX Developer | Next.js pages, components, charts |
| `backend/api/` | Backend Engineer | FastAPI routes |
| `backend/agents/` | Backend + Data Scientist | LangChain agents |
| `backend/ml/` | Data Scientist | ML models, training scripts |
| `backend/scrapers/` | Backend Engineer | Scrapy spiders |
| `backend/pipelines/` | Data Scientist + Backend | Airflow DAGs, Celery tasks |
| `mcp-servers/` | Backend Engineer | MCP server implementations |
| `docs/` | Communications Lead | Documentation, pitch materials |

---

## Setting Up Your Environment

```bash
# 1. Clone
git clone https://github.com/HasiburRahmanShafin/industryphere-ai.git
cd industryphere-ai

# 2. Create your branch
git checkout develop
git checkout -b feat/your-feature-name

# 3. Set up environment
cp .env.example .env
# Fill in your API keys in .env

# 4. Start services
docker-compose up -d

# 5. Install dependencies
cd frontend && npm install
cd ../backend && pip install -r requirements.txt
```

---

## Commit Message Format

```
type(scope): short description

Examples:
feat(dashboard): add real-time OEE gauge chart
fix(agents): handle missing sensor data gracefully
docs(architecture): update Neo4j schema diagram
chore(deps): upgrade LangChain to 0.3.1
```

Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`

---

## Environment Variables

Copy `.env.example` and fill in your values. **Never commit `.env` to git.**

```env
# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Neo4j
NEO4J_URI=neo4j+s://...
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=...

# Notifications
SSLCOMMERZ_SMS_API_KEY=...
WATI_API_TOKEN=...
SENDGRID_API_KEY=...

# Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434
```

---

## Code Standards

- **Python:** Follow PEP 8. Use type hints everywhere. Run `ruff check .` before committing.
- **TypeScript:** Use strict mode. No `any` types without a comment explaining why.
- **All:** No hard-coded API keys, passwords, or URLs. Use environment variables.

---

## Need Help?

Open a GitHub Issue with the label `question` and tag the relevant team member.
