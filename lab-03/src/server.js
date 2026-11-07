
const app = require("./app");
const db = require("./config/database");
const initializeDatabase = require("./config/initializeDatabase");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Lab 3 server running on port ${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
      } else {
        console.error("Server error:", error.message);
      }

      db.close();
      process.exit(1);
    });
  } catch (error) {
    console.error("Application startup failed:", error.message);
    db.close();
    process.exit(1);
  }
}

startServer();
