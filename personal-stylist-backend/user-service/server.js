"use strict";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();
const mongoose = require("mongoose");

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || process.env.DEV_APP_PORT || 3001;

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use a more robust connection approach with retries
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/personal-stylist";
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(
      `✅ Connected to MongoDB [${conn.connection.host}] successfully!`
    );
  } catch (error) {
    console.error(`❌ MongoDB connection error:`, error);
    console.log(
      "⚠️ Running in development mode without database. Some features will be limited."
    );
    // Don't exit the process to allow the API to run even without DB
    // process.exit(1);
  }
};

// Call the connect function
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Import routes - Move this after MongoDB connection to ensure models are registered
const userRoutes = require("./routes/user.routes");

// Routes
app.use("/api/users", userRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User service is running",
    service: "user-service",
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("User Service API - Personal Stylist App");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  // process.exit(1); - Comment this out to prevent crash
});

module.exports = app;
