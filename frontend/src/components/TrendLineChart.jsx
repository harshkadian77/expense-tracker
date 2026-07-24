import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TrendLineChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty-state">No trend data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
        <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
