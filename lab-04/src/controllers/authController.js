
const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT secret key (as required by Lab 4)
const JWT_SECRET = "lab4_jwt_secret_key";

const register = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
      return res.status(400).json({
        message: "Username, name and password are required."
      });
    }

    db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (error, user) => {
        if (error) {
          return res.status(500).json({
            message: "Database error."
          });
        }

        if (user) {
          return res.status(400).json({
            message: "Username already exists."
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          "INSERT INTO users (username, name, password) VALUES (?, ?, ?)",
          [username, name, hashedPassword],
          function (insertError) {
            if (insertError) {
              return res.status(500).json({
                message: "User registration failed."
              });
            }

            return res.status(201).json({
              message: "User registered successfully.",
              userId: this.lastID
            });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error."
    });
  }
};

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required."
    });
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (error, user) => {
      if (error) {
        return res.status(500).json({
          message: "Database error."
        });
      }

      if (!user) {
        return res.status(400).json({
          message: "User not found."
        });
      }

      try {
        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatch) {
          return res.status(400).json({
            message: "Invalid password."
          });
        }

        const token = jwt.sign(
          { username: user.username },
          JWT_SECRET
        );

        return res.status(200).json({
          jwt_token: token
        });
      } catch (compareError) {
        return res.status(500).json({
          message: "Login failed."
        });
      }
    }
  );
};

module.exports = { register, login };
