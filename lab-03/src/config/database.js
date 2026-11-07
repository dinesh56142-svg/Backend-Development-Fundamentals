
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(
  __dirname,
  "../../database/lab3_library.db"
);

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }

  console.log("Lab 3 SQLite database connected successfully.");
});

module.exports = db;
