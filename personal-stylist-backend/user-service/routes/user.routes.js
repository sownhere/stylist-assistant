"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Determine if we're connected to MongoDB
const isDbConnected = () => mongoose.connection.readyState === 1;

// Dynamic imports based on DB connectivity
const getUserController = () => {
  return isDbConnected()
    ? require("../controllers/user.controller")
    : require("../controllers/dev.controller");
};

const getAuthMiddleware = () => {
  return isDbConnected()
    ? require("../middlewares/auth.middleware")
    : require("../middlewares/dev.middleware");
};

// Debug route to check path accessibility
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User API is working",
    availableRoutes: [
      "/register",
      "/login",
      "/auth/google",
      "/auth/apple",
      "/profile",
      "/preferences",
    ],
  });
});

// Public routes
router.post("/register", (req, res) => {
  console.log("Register route accessed");
  const UserController = getUserController();
  UserController.register(req, res);
});

router.post("/login", (req, res) => {
  console.log("Login route accessed");
  const UserController = getUserController();
  UserController.login(req, res);
});

router.post("/auth/google", (req, res) => {
  const UserController = getUserController();
  UserController.googleAuth(req, res);
});

router.post("/auth/apple", (req, res) => {
  const UserController = getUserController();
  UserController.appleAuth(req, res);
});

// Protected routes - require authentication
router.get("/profile", (req, res, next) => {
  console.log("Profile route accessed");
  try {
    const { auth } = getAuthMiddleware();
    auth(req, res, () => {
      const UserController = getUserController();
      UserController.getProfile(req, res);
    });
  } catch (error) {
    console.error("Profile route error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing profile request",
      error: error.message,
    });
  }
});

// Add an unprotected profile route for testing
router.get("/profile-test", (req, res) => {
  console.log("Test profile route accessed");
  const UserController = getUserController();
  // Use try-catch to handle any potential errors
  try {
    const mockUser = { id: "test-user" };
    req.user = mockUser;
    UserController.getProfile(req, res);
  } catch (error) {
    console.error("Profile test error:", error);
    res.status(500).json({
      success: false,
      message: "Error in test profile route",
      error: error.message,
    });
  }
});

router.put("/profile", (req, res, next) => {
  try {
    const { auth } = getAuthMiddleware();
    auth(req, res, () => {
      const UserController = getUserController();
      UserController.updateProfile(req, res);
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing update profile request",
      error: error.message,
    });
  }
});

router.put("/preferences", (req, res, next) => {
  try {
    const { auth } = getAuthMiddleware();
    auth(req, res, () => {
      const UserController = getUserController();
      UserController.updatePreferences(req, res);
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing update preferences request",
      error: error.message,
    });
  }
});

// Admin routes - require admin role
router.get("/admin/dashboard", (req, res, next) => {
  try {
    const { auth, adminAuth } = getAuthMiddleware();
    auth(req, res, () => {
      adminAuth(req, res, () => {
        res.status(200).json({
          success: true,
          message: "Admin dashboard accessed successfully",
          user: req.user,
        });
      });
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error accessing admin dashboard",
      error: error.message,
    });
  }
});

module.exports = router;
