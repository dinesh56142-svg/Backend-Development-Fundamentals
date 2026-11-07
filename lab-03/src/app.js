
const express = require("express");
const booksRoutes = require("./routes/booksRoutes");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Lab 3 REST API is running successfully.",
    project: "Backend Development Fundamentals - Lab 3"
  });
});

app.use("/books", booksRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found."
  });
});

module.exports = app;
