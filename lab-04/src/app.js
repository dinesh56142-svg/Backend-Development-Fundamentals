
const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Lab 4 Registration and Login API is running."
  });
});

app.use("/", authRoutes);

module.exports = app;
