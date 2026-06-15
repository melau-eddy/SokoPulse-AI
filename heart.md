# 💜 SokoPulse - Project Heart & Continuity

This file maintains the architecture, dependencies, and history of the project for agent continuity.

## 🏗️ Project Architecture & Structure
- **Backend:** Python (Django 6.x, Django REST Framework, Celery background tasks, Redis broker, PostgreSQL/SQLite).
- **Frontend:** TypeScript React (Vite, TanStack Start / file-based routing, TailwindCSS, Recharts).
- **Orchestration:** Docker Compose (db, redis, backend, celery_worker, celery_beat, frontend).

### 📂 File Structure (Top-level)
- `backend/` (Django backend & Celery tasks)
- `frontend/` (React Vite client app)
- `docker-compose.yml` (Docker services configuration)
- `package.json` (Workspace commands)

## 📦 Dependencies & Packages
- **Backend Core:** `django`, `djangorestframework`, `djangorestframework-simplejwt`, `django-cors-headers`, `psycopg2-binary`.
- **Machine Learning & Scraping:** `scikit-learn`, `pandas`, `numpy`, `joblib`, `requests`, `beautifulsoup4`, `google-generativeai`.
- **Background Tasks:** `celery`, `redis`.
- **Frontend Core:** `react`, `@tanstack/react-router`, `lucide-react`, `recharts`, `sonner`.

---

## 🕒 Session Log

### [2026-06-12] - ML Forecasting & Database Tap Connector Upgrades
- **Competitor Scraper Performance & Resiliency:**
  - Integrated `ThreadPoolExecutor` to execute competitor price requests concurrently.
  - Implemented dynamic browser User-Agent header rotation to prevent anti-bot blocking.
  - Added structured `application/ld+json` JSON-LD schema parsing to extract product pricing robustly.
  - Implemented an startup reachability check to skip connection timeouts in offline/development mode, improving execution speed from **80s to <1s**.
  - Added try-except blocks to catch database `IntegrityError` during seeding/scraping race conditions.
- **Machine Learning Demand Forecasting & Overstock markdowns:**
  - Replaced mock values with actual RandomForest model forecasts in the intelligence pipeline.
  - Created a recursive daily forecasting loop predicting sales demand for the next 30 days.
  - Added sales trend detection comparing current sales volumes to the plugin date.
  - Connected competitor scraper pricing average telemetry to automatically recommend price markdowns (up to 10%) on overstocked items.
  - Integrated ML-driven forecast predictions directly into the frontend forecasting dashboard charts.
- **Business Database Tap Connector:**
  - Implemented dynamic table and column schema mapping to tap into external SQLite files.
  - Created the `/api/sync/database/` backend sync controller endpoint.
  - Added the **Business Database Tap Connector** settings panel under the API & Integrations tab.
