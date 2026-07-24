# Expense Tracker / Personal Finance Dashboard
To see the deployed app use the given link - https://expense-tracker-five-smoky-75.vercel.app

A full-stack expense tracker with data visualization, built to demonstrate:
- MongoDB **aggregation pipelines** (monthly summaries, category breakdowns, trends)
- React + **Recharts** data visualization
- A clean REST API with JWT authentication

---

## Project Structure

```
expense-tracker/
├── backend/          Express API + MongoDB
│   ├── config/db.js
│   ├── models/        User.js, Transaction.js
│   ├── middleware/     auth.js (JWT verification)
│   ├── controllers/    authController.js, transactionController.js, summaryController.js
│   ├── routes/         authRoutes.js, transactionRoutes.js, summaryRoutes.js
│   └── server.js
└── frontend/          React + Vite + Recharts
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── pages/       Login.jsx, Register.jsx, Dashboard.jsx
        └── components/  SummaryCards, CategoryPieChart, TrendLineChart,
                          TransactionForm, TransactionList
```

---

## Prerequisites

Before you start, make sure you have installed:
1. **Node.js** (v18 or higher) — check with `node -v`
2. **MongoDB** — either:
   - Install locally ([MongoDB Community Server](https://www.mongodb.com/try/download/community)), OR
   - Use a free cloud database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (easier for beginners — no local install needed)

---

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET=any_long_random_string_here
```

> If using MongoDB Atlas, `MONGO_URI` will look like:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker`

Start the backend:

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:5000
MongoDB connected: ...
```

### 2. Frontend Setup

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install
```

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

The default is already correct if your backend runs on port 5000:
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

---

## How to Use the App

1. Go to `/register` and create an account
2. You'll be redirected to the dashboard
3. Add a few transactions (both income and expense, different categories)
4. Watch the charts and summary cards update automatically

---

## Understanding the Aggregation Pipelines (important for interviews!)

All three pipelines live in `backend/controllers/summaryController.js`. Take time to actually read through them — this is the part that sets this project apart from a basic CRUD app.

1. **`getMonthlySummary`** — `$match` (filter by user + date range) → `$group` by transaction type → sum amounts. Powers the 3 summary cards.
2. **`getCategoryBreakdown`** — `$match` (filter by user + type) → `$group` by category → `$sort` → `$project` reshapes into `{name, value}` for the pie chart.
3. **`getMonthlyTrend`** — `$match` (last N months) → `$group` by `{year, month, type}` together → `$sort` chronologically. The result is reshaped in JS into one row per month with `income` and `expense` keys, ready for a multi-line chart.

**Tip for your resume/interview:** be ready to explain *why* `$match` comes first in each pipeline (it filters documents before the more expensive `$group` stage runs — better performance), and why we added indexes on `{userId, date}`, `{userId, type}`, and `{userId, category}` in the `Transaction` model.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/transactions` | Yes | List transactions (supports `?startDate&endDate&category&type`) |
| POST | `/api/transactions` | Yes | Add a transaction |
| PUT | `/api/transactions/:id` | Yes | Edit a transaction |
| DELETE | `/api/transactions/:id` | Yes | Delete a transaction |
| GET | `/api/summary/monthly` | Yes | Total income/expense/net for a month |
| GET | `/api/summary/category` | Yes | Category-wise breakdown (for pie chart) |
| GET | `/api/summary/trend` | Yes | Monthly income/expense trend (for line chart) |

All authenticated routes expect a header: `Authorization: Bearer <token>`

---

## Ideas for Extending This Project (bonus points)

- [ ] Budget limits per category with over-budget alerts
- [ ] Export transactions to CSV/PDF
- [ ] Recurring transactions (e.g. monthly rent auto-added)
- [ ] Dark mode toggle
- [ ] Pagination on the transaction list
- [ ] Deploy backend to Render/Railway and frontend to Vercel/Netlify, then add the live link to your resume

---

## Troubleshooting

- **"MongoDB connection error"** — Make sure MongoDB is running locally, or your Atlas connection string/IP whitelist is correct.
- **CORS errors in browser console** — Make sure the backend is running and `VITE_API_URL` in frontend `.env` matches it.
- **401 Unauthorized on API calls** — Your JWT token may have expired (7 day expiry) or you're not logged in; try logging in again.
