const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.use(protect); // all routes below require a valid JWT

router.post("/", createTransaction);
router.get("/", getTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
