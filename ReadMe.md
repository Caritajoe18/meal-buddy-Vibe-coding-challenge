# Meal Buddy

AI-powered meal planner with Supabase authentication, subscription handling, and an OpenAI-powered backend.

This project is a **monorepo** with two workspaces:

* **frontend/** — React + Vite app
* **backend/** — FastAPI + Supabase + OpenAI app

---

## 🚀 Features

* User authentication with Supabase
* Demo subscription handling (saved to Supabase)
* AI-generated meal plans via OpenAI
* Monorepo structure with `npm workspaces`

---

## 📦 Prerequisites

Make sure you have these installed:

* **Node.js** (v18+) + **npm**
* **Python** (3.9+)
* **Git**
* A **Supabase project** (with URL + API keys)
* An **OpenAI API key**

---

## 🛠 Setup Instructions

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url> vibe-app
cd vibe-app
npm install
```

This installs dependencies for both `frontend/` and `backend/` via workspaces.

---

### 2. Environment Variables

#### Root `.env`

Create a `.env` file in the root (or in `frontend/.env`) with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE=http://localhost:8000
```

#### Backend `.env`

Create `backend/.env` with:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
```

---

### 3. Database Setup in Supabase

Run the SQL in `supabase/schema.sql` inside the Supabase SQL Editor:

```sql
-- Profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null,
  email text,
  location text,
  primary key (id)
);

-- Subscriptions table
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan text,
  status text,
  created_at timestamp default now()
);
```

Enable **Row Level Security (RLS)** and policies so users can only access their own records.

---

### 4. Running the Backend

#### Mac/Linux

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Windows (PowerShell)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend should now be running at:
👉 `http://localhost:8000`

Test docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 5. Running the Frontend

From the project root:

```bash
npm run dev:frontend
```

Then open:
👉 [http://localhost:5173](http://localhost:5173)

---

## ⚡ Demo Flow

1. Sign up / log in with Supabase (magic link auth).
2. Subscribe to a plan (demo — writes to Supabase).
3. Enter ingredients + preferences.
4. Generate your personalized meal plan via the backend AI.

---

## 🖥 Deployment

* **Frontend** → Vercel (`frontend/`)
* **Backend** → Railway/Render (`backend/`)
* **Database/Auth** → Supabase

(see deployment guide coming soon)

---

## 📌 Notes

* Subscriptions are **demo-only** (no real payments yet).
* You can integrate **Paystack/Flutterwave** later for real billing.
* For Supabase RLS policies, make sure only the logged-in user can access their own `profile` and `subscription` records.
