"use strict";

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

class UserService {
  static async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        return { success: false, message: "Email already in use" };
      }

      // Create new user
      const user = await User.create(userData);
      const token = user.getSignedJwtToken();

      return {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          emailVerified: user.emailVerified,
        },
        token,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async loginUser(email, password) {
    try {
      // Check if user exists
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return { success: false, message: "Invalid credentials" };
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return { success: false, message: "Invalid credentials" };
      }

      const token = user.getSignedJwtToken();

      return {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          emailVerified: user.emailVerified,
        },
        token,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async updateUserProfile(userId, updateData) {
    try {
      // Prevent password update through this method for security
      if (updateData.password) {
        delete updateData.password;
      }

      // Prevent role update through this method for security
      if (updateData.role) {
        delete updateData.role;
      }

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async updateUserPreferences(userId, preferences) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { preferences },
        { new: true, runValidators: true }
      );

      if (!user) {
        return { success: false, message: "User not found" };
      }

      return {
        success: true,
        data: {
          preferences: user.preferences,
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  static async findOrCreateOAuthUser(profile, provider) {
    try {
      let user;

      // Check if user already exists with this OAuth account
      const oauthField = provider === "google" ? "googleId" : "appleId";
      const query = { [oauthField]: profile.id };

      user = await User.findOne(query);

      // If user doesn't exist with OAuth ID, check by email
      if (!user && profile.email) {
        user = await User.findOne({ email: profile.email });

        // If user exists with email but no OAuth ID, update with OAuth ID
        if (user) {
          user[oauthField] = profile.id;
          await user.save();
        }
      }

      // If still no user, create a new one
      if (!user) {
        const userData = {
          name: profile.name || "User",
          email: profile.email,
          [oauthField]: profile.id,
          emailVerified: true, // OAuth emails are typically verified
          avatar: profile.picture || "default-avatar.jpg",
        };

        user = await User.create(userData);
      }

      const token = user.getSignedJwtToken();

      return {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          emailVerified: user.emailVerified,
        },
        token,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = UserService;
