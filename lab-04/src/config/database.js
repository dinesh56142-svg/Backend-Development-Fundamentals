
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const databaseFolder = path.join(__dirname, "../../database");

if (!fs.existsSync(databaseFolder)) {
  fs.mkdirSync(databaseFolder, { recursive: true });
}

const databasePath = path.join(databaseFolder, "users.db");

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
  } else {
    console.log("Lab 4 SQLite database connected successfully.");
  }
});

module.exports = db;
