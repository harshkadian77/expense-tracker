const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// GET /api/summary/monthly?month=7&year=2026
// Returns total income, total expense, and net savings for a given month
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1; // 1-12
    const year = parseInt(req.query.year) || now.getFullYear();

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const result = await Transaction.aggregate([
      // Stage 1: only this user's transactions within the month
      { $match: { userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      // Stage 2: group by type and sum amounts
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // result looks like: [ { _id: "income", total: 5000, count: 2 }, { _id: "expense", total: 3200, count: 8 } ]
    const summary = { income: 0, expense: 0 };
    result.forEach((item) => {
      summary[item._id] = item.total;
    });
    summary.net = summary.income - summary.expense;
    summary.month = month;
    summary.year = year;

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/summary/category?type=expense
// Groups transactions by category — feeds directly into a pie/donut chart
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const type = req.query.type || "expense";

    const result = await Transaction.aggregate([
      { $match: { userId, type } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      // Reshape to {name, value} which Recharts' PieChart expects
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: "$total",
          count: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/summary/trend?months=6
// Groups by year+month+type together — feeds a multi-line trend chart
exports.getMonthlyTrend = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const monthsBack = parseInt(req.query.months) || 6;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (monthsBack - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const result = await Transaction.aggregate([
      { $match: { userId, date: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Reshape into: [{ label: "2026-06", income: 5000, expense: 3200 }, ...]
    const shaped = {};
    result.forEach((item) => {
      const { year, month, type } = item._id;
      const label = `${year}-${String(month).padStart(2, "0")}`;
      if (!shaped[label]) shaped[label] = { label, income: 0, expense: 0 };
      shaped[label][type] = item.total;
    });

    res.json(Object.values(shaped));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
