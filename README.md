# SpendWise – Smart Expense Tracker

A simple full-stack expense tracker built with the MERN stack (React + Vite, Node.js + Express, MongoDB + Mongoose). It started as a college mini project (HTML/CSS/JavaScript with localStorage) and now stores real data in MongoDB.

## Pages

| Page | What it does |
| --- | --- |
| **Dashboard** | Total Balance, Total Income, Total Expenses, This Month Expenses, a simple monthly expense chart, and the latest transactions |
| **Transactions** | Add, edit, delete, search (description / category / amount) and filter (Income/Expense, category, date) |
| **Categories** | Default categories (Food, Transport, Bills, Shopping, Education, Entertainment, Other) plus add / delete your own |
| **Settings** | Change your name, reset all transactions, log out |

Login / register is kept (JWT + hashed passwords). There is **no demo or hard-coded financial data**: a new account starts empty and shows "No transactions yet".

## How the numbers are calculated (all from MongoDB)
- **Total Income** = sum of all income transactions
- **Total Expenses** = sum of all expense transactions
- **Total Balance** = Total Income − Total Expenses
- **This Month Expenses** = sum of expense transactions in the current month
- **Monthly chart** = expense totals for each of the last 6 months
- Everything is recalculated from the database on each request, so it updates after every add / edit / delete.

## Tech Stack
React · Vite · React Router · Axios · Recharts · Lucide React · Node.js · Express · MongoDB · Mongoose · JWT

## Project Structure
```
backend/
  config/        MongoDB connection
  controllers/   auth, transactions, categories, dashboard, settings
  middleware/    JWT auth, error handling
  models/        User, Transaction, Category
  routes/        Express routers
  utils/         validation, calculations, default-category setup
  server.js
frontend/src/
  components/    Sidebar, StatCard, TransactionTable/Form/Card, FilterBar, SearchBar, Charts, Modal ...
  pages/         Login, Dashboard, TransactionsPage, Categories, Settings
  hooks/ layouts/ routes/ services/ context/ utils/ styles/
```

## Installation
Requires Node.js 18+ and MongoDB (local or Atlas).

```bash
# backend
cd backend && npm install
cp .env.example .env        # set MONGO_URI and a long random JWT_SECRET
npm run dev                 # http://localhost:5000

# frontend (new terminal)
cd frontend && npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

Register a new account, then start adding transactions.

## API
All routes except `/api/auth/*` need `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Create account / log in |
| GET, PUT | `/api/auth/me` | Current user / update name |
| GET, POST | `/api/transactions` | List (query: `q, type, category, from, to, page, limit`) / create |
| GET, PUT, DELETE | `/api/transactions/:id` | One / update / delete |
| GET, POST | `/api/categories` | List / create |
| DELETE | `/api/categories/:id` | Delete (blocked while transactions use it) |
| GET | `/api/dashboard/summary` | Totals, monthly chart data, recent transactions |
| DELETE | `/api/settings/data` | Delete all of the user's transactions |

Errors use proper status codes (400 validation, 401 auth, 404 not found, 409 conflict) with a `message` and per-field `errors`.
