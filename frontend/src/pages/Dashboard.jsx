import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SummaryCards from "../components/SummaryCards";
import CategoryPieChart from "../components/CategoryPieChart";
import TrendLineChart from "../components/TrendLineChart";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, categoryRes, trendRes, txRes] = await Promise.all([
        api.get("/summary/monthly"),
        api.get("/summary/category", { params: { type: "expense" } }),
        api.get("/summary/trend", { params: { months: 6 } }),
        api.get("/transactions"),
      ]);
      setSummary(summaryRes.data);
      setCategoryData(categoryRes.data);
      setTrendData(trendRes.data);
      setTransactions(txRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Expense Tracker</h1>
        <div className="header-right">
          <span>Hi, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <div className="chart-grid">
            <div className="chart-card">
              <h3>Expenses by Category</h3>
              <CategoryPieChart data={categoryData} />
            </div>
            <div className="chart-card">
              <h3>Income vs Expense (last 6 months)</h3>
              <TrendLineChart data={trendData} />
            </div>
          </div>

          <div className="content-grid">
            <TransactionForm onCreated={loadAll} />
            <TransactionList transactions={transactions} onChanged={loadAll} />
          </div>
        </>
      )}
    </div>
  );
}
