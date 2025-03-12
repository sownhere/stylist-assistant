"use strict";

// Development/mock controller when MongoDB isn't available
class DevController {
  static register(req, res) {
    res.status(201).json({
      success: true,
      message: "Development mode: User registration simulated",
      data: {
        _id: "mock-user-id",
        ...req.body,
        role: "user",
        createdAt: new Date().toISOString(),
      },
      token: "mock-jwt-token",
    });
  }

  static login(req, res) {
    res.status(200).json({
      success: true,
      message: "Development mode: User login simulated",
      data: {
        _id: "mock-user-id",
        email: req.body.email,
        name: "Dev User",
        role: "user",
      },
      token: "mock-jwt-token",
    });
  }

  static googleAuth(req, res) {
    res.status(200).json({
      success: true,
      message: "Development mode: Google authentication simulated",
      data: {
        _id: "mock-user-id",
        email: "google-user@example.com",
        name: "Google User",
        role: "user",
        emailVerified: true,
      },
      token: "mock-jwt-token",
    });
  }

  static appleAuth(req, res) {
    res.status(200).json({
      success: true,
      message: "Development mode: Apple authentication simulated",
      data: {
        _id: "mock-user-id",
        email: "apple-user@example.com",
        name: "Apple User",
        role: "user",
        emailVerified: true,
      },
      token: "mock-jwt-token",
    });
  }

  static getProfile(req, res) {
    console.log("Dev controller getProfile called with user:", req.user);

    // If no user is attached to the request (should not happen with dev middleware)
    if (!req.user) {
      console.warn("No user found in request");
      return res.status(401).json({
        success: false,
        message: "Development mode: Authentication required",
      });
    }

    res.status(200).json({
      success: true,
      message: "Development mode: User profile retrieved",
      data: {
        _id: req.user.id || "mock-user-id",
        name: "Dev User",
        email: req.user.email || "dev@example.com",
        role: req.user.role || "user",
        preferences: {
          style: ["casual", "formal"],
          colors: ["blue", "black"],
          sizes: { top: "M", bottom: "32" },
          occasions: ["everyday", "work"],
        },
      },
    });
  }

  static updateProfile(req, res) {
    res.status(200).json({
      success: true,
      message: "Development mode: Profile updated successfully",
      data: {
        _id: "mock-user-id",
        ...req.body,
      },
    });
  }

  static updatePreferences(req, res) {
    res.status(200).json({
      success: true,
      message: "Development mode: Preferences updated successfully",
      data: {
        preferences: req.body,
      },
    });
  }
}

module.exports = DevController;
