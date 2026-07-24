const Transaction = require("../models/Transaction");

// POST /api/transactions
exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category) {
      return res.status(400).json({ message: "amount, type, and category are required" });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      amount,
      type,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/transactions?startDate&endDate&category&type
exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    const filter = { userId: req.userId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (category) filter.category = category;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
