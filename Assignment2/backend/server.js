const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Configure CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Import routes
const userRoutes = require("./routers/user");
const employeeRoutes = require("./routers/employee");

// Connect to MongoDB
const DB_URL = process.env.MONGO_URI;
mongoose
  .connect(DB_URL, { dbName: "AssignmentTwo" })
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Route handlers
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Hello, Welcome to COMP3123 Assignment");
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(`Route ${req.url} not found.`);
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
