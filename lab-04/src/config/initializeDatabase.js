
const db = require("./database");

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `;

    db.run(query, (error) => {
      if (error) {
        console.error("Users table initialization failed:", error.message);
        reject(error);
      } else {
        console.log("Users table initialized successfully.");
        resolve();
      }
    });
  });
}

module.exports = initializeDatabase;
