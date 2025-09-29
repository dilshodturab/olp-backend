const express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).send("This dils is users route" + req.body);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).send("kerakli parametrlarni berib yuborish kerak");

    const { full_name, email, password } = req.body;

    if (!req.body || !full_name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required: full_name, email, password",
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "User already exists with this email" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at",
      [full_name, email, hashedPassword],
    );

    const newUser = result.rows[0];
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
