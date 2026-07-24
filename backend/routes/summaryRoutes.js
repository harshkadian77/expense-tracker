const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getMonthlySummary,
  getCategoryBreakdown,
  getMonthlyTrend,
} = require("../controllers/summaryController");

router.use(protect);

router.get("/monthly", getMonthlySummary);
router.get("/category", getCategoryBreakdown);
router.get("/trend", getMonthlyTrend);

module.exports = router;
