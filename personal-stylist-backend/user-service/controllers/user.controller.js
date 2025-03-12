"use strict";

const UserService = require("../services/user.service");
const OAuthMiddleware = require("../middlewares/oauth.middleware");

class UserController {
  // Register a new user
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide name, email, and password",
        });
      }

      const result = await UserService.registerUser({
        name,
        email,
        password,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }

  // User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password",
        });
      }

      const result = await UserService.loginUser(email, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }

  // Google OAuth login/register
  static async googleAuth(req, res) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: "Please provide Google ID token",
        });
      }

      // Verify the Google token
      const googleUser = await OAuthMiddleware.verifyGoogleToken(idToken);

      // Find or create user with Google profile
      const result = await UserService.findOrCreateOAuthUser(
        googleUser,
        "google"
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Server error during Google authentication",
      });
    }
  }

  // Apple OAuth login/register
  static async appleAuth(req, res) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: "Please provide Apple ID token",
        });
      }

      // Generate Apple client secret for verification
      const clientSecret = OAuthMiddleware.generateAppleClientSecret();

      // Verify the Apple token
      const appleUser = await OAuthMiddleware.verifyAppleToken(
        idToken,
        clientSecret
      );

      // Find or create user with Apple profile
      const result = await UserService.findOrCreateOAuthUser(
        appleUser,
        "apple"
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Apple auth error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Server error during Apple authentication",
      });
    }
  }

  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const result = await UserService.getUserProfile(userId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching profile",
      });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const result = await UserService.updateUserProfile(userId, updateData);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating profile",
      });
    }
  }

  // Update user preferences
  static async updatePreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = req.body;

      const result = await UserService.updateUserPreferences(
        userId,
        preferences
      );

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating preferences",
      });
    }
  }
}

module.exports = UserController;
