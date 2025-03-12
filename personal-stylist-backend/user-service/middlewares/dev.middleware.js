"use strict";

// A simple mock authentication middleware for development
const auth = (req, res, next) => {
  console.log("Dev auth middleware called");
  // Attach mock user to request
  req.user = {
    id: "mock-user-id",
    email: "dev@example.com",
    role: "user",
  };
  next();
};

// A simple mock admin authentication middleware for development
const adminAuth = (req, res, next) => {
  console.log("Dev admin auth middleware called");
  // Check if already authenticated by auth middleware
  if (!req.user) {
    req.user = {
      id: "mock-admin-id",
      email: "admin@example.com",
      role: "admin",
    };
  } else {
    // Override the role if needed
    req.user.role = "admin";
  }
  next();
};

module.exports = { auth, adminAuth, devAuth: auth, devAdminAuth: adminAuth };
