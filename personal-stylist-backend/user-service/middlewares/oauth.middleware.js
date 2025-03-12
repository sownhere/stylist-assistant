"use strict";

const axios = require("axios");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

class OAuthMiddleware {
  // Google OAuth verification
  static async verifyGoogleToken(token) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      // Verify the token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      // Get user info from the token
      const payload = ticket.getPayload();

      // Construct user profile from Google data
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified,
      };
    } catch (error) {
      console.error("Google token verification error:", error);
      throw new Error("Invalid Google token");
    }
  }

  // Apple OAuth verification
  static async verifyAppleToken(token, clientSecret) {
    try {
      // For Apple Sign In, we need to verify the JWT token
      // Apple tokens are JWTs that can be verified
      const decodedToken = jwt.decode(token);

      if (!decodedToken) {
        throw new Error("Invalid Apple token");
      }

      // Additional validation can be performed here like
      // checking issuer, expiration, audience, etc.

      // For production, you should validate the token with Apple's public key
      // This is a simplified example

      // Extract user info
      return {
        id: decodedToken.sub,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified || true,
      };
    } catch (error) {
      console.error("Apple token verification error:", error);
      throw new Error("Invalid Apple token");
    }
  }

  // Generate Apple client secret (required for Apple Sign In)
  static generateAppleClientSecret() {
    // Apple requires a JWT token signed with your private key
    // as the client secret
    const now = Math.floor(Date.now() / 1000);
    const clientSecret = jwt.sign(
      {
        iss: process.env.APPLE_TEAM_ID,
        iat: now,
        exp: now + 15777000, // 6 months
        aud: "https://appleid.apple.com",
        sub: process.env.APPLE_CLIENT_ID,
      },
      process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      {
        algorithm: "ES256",
        header: {
          kid: process.env.APPLE_KEY_ID,
        },
      }
    );

    return clientSecret;
  }
}

module.exports = OAuthMiddleware;
