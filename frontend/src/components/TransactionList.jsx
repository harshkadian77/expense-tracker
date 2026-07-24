import api from "../api/axios";

export default function TransactionList({ transactions, onChanged }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    onChanged();
  };

  if (!transactions || transactions.length === 0) {
    return <p className="empty-state">No transactions yet. Add your first one above.</p>;
  }

  return (
    <table className="transaction-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id}>
            <td>{new Date(t.date).toLocaleDateString("en-IN")}</td>
            <td>
              <span className={`badge ${t.type}`}>{t.type}</span>
            </td>
            <td>{t.category}</td>
            <td>{t.description || "—"}</td>
            <td className={t.type === "income" ? "amount-income" : "amount-expense"}>
              {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
            </td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(t._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
