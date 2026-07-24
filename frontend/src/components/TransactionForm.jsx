import { useState } from "react";
import api from "../api/axios";

const CATEGORIES = ["Food", "Rent", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Salary", "Other"];

export default function TransactionForm({ onCreated }) {
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "Food",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/transactions", { ...form, amount: Number(form.amount) });
      setForm({ ...form, amount: "", description: "" });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>
      {error && <p className="error">{error}</p>}
      <div className="form-row">
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          min="0"
          step="0.01"
          required
        />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </div>
      <input
        type="text"
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
      />
      <button type="submit">Add</button>
    </form>
  );
}
