"use strict";

const mongoose = require("mongoose");
const {
  db: { protocol, username, password, dbName },
} = require("./config.mongodb");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    // Encode credentials for URL
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);

    // Build connection string based on environment
    let connectString;
    if (protocol.includes("+srv")) {
      // Atlas connection string format
      connectString = `${protocol}://${encodedUsername}:${encodedPassword}@${dbName}.5ixeh.mongodb.net/${dbName}?retryWrites=true&w=majority&ssl=true&appName=PersonalStylist`;
    } else {
      // Standard connection string format (for local or other MongoDB instances)
      connectString = `${protocol}://${encodedUsername}:${encodedPassword}@localhost:27017/${dbName}`;
    }

    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to MongoDB
    mongoose
      .connect(connectString, options)
      .then(() => {
        console.log(`✅ Connected to MongoDB [${dbName}] successfully!`);
      })
      .catch((err) => {
        console.error(`❌ MongoDB connection error:`, err);
        process.exit(1); // Exit on connection failure
      });

    // Event listeners for MongoDB connection
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });
  }

  // Singleton pattern
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
