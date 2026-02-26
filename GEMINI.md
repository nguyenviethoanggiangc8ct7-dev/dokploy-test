# QLTSIT - Quản Lý Tài Sản IT (IT Asset Management)

## Vibe Builder Project Reference

### ⛔ CONTEXT OVERFLOW RECOVERY
**When context gets full or you feel lost in a long session:**
1. Re-read the vibe-builder skill: `.claude/skills/vibe-builder/CLAUDE.md`
2. Re-read `IMPLEMENTATION_PLAN.md` to check current progress
3. Re-read `TEST_PLAN.md` (if exists) to check test status
4. Follow the workflow strictly - especially the checkpoints below!

### ⚠️ WORKFLOW CHECKPOINTS (MANDATORY - DO NOT SKIP!)
| After Phase | Action |
| --- | --- |
| Phase 3 (Coding) complete | → Create TEST_PLAN.md → **⛔ STOP for Human review** |
| Phase 4 (Test Plan) approved | → Execute tests autonomously |
| Phase 5 (Testing) complete | → Report results → Enter Phase 6 loop |

**CRITICAL:** After finishing ALL coding tasks, you MUST:
1. Create TEST_PLAN.md
2. **⛔ STOP and wait for Human approval**
3. DO NOT run any tests until Human reviews TEST_PLAN.md!

### Project Summary (UPDATE IN PHASE 2!)
- **App Type**: Web Application (Full-stack with Docker)
- **Tech Stack**: TypeScript + React + Vite + Express.js + Prisma + PostgreSQL + Docker
- **Frontend**: React 18 + Zustand + Vanilla CSS + Recharts + Lucide React
- **Backend**: Express.js + Prisma ORM + PostgreSQL 16
- **Docker**: docker-compose (db, backend, frontend)
- **Core Features**: Hardware asset tracking, Software license management, Dashboard analytics, Reports, Categories/Locations management
- **Current Phase**: Phase 2 (Planning & Review)

### Primary Documentation
- `PRD.md` - Full product requirements (lazy-read sections when needed)
- `IMPLEMENTATION_PLAN.md` - Task tracking with checkboxes
- `TEST_PLAN.md` - Test cases and results (created in Phase 4)

### Coding Guidelines
- Follow `IMPLEMENTATION_PLAN.md` for tasks
- Use TypeScript with strict mode
- Mark completed tasks with `[x]`
- Keep code minimal and focused
- Use Vanilla CSS for styling (no CSS frameworks)
- Use Zustand for state management with localStorage persistence
