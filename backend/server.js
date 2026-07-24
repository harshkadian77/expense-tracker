// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const summaryRoutes = require("./routes/summaryRoutes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/summary", summaryRoutes);

// app.get("/", (req, res) => {
//   res.json({ message: "Expense Tracker API is running" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const summaryRoutes = require("./routes/summaryRoutes");

const app = express();

// Middleware
// CLIENT_URL can be a comma-separated list, e.g. "http://localhost:5173,https://your-app.vercel.app"
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(",");
app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/summary", summaryRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});