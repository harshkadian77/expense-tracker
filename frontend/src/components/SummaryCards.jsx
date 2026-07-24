export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    { label: "Income", value: summary.income, className: "card income" },
    { label: "Expense", value: summary.expense, className: "card expense" },
    { label: "Net Savings", value: summary.net, className: "card net" },
  ];

  return (
    <div className="summary-cards">
      {cards.map((c) => (
        <div key={c.label} className={c.className}>
          <p className="card-label">{c.label}</p>
          <h3 className="card-value">₹{c.value.toLocaleString("en-IN")}</h3>
        </div>
      ))}
    </div>
  );
}
