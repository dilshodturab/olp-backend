const express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).send("kerakli parametrlarni berib yuborish kerak");

    const { full_name, email, password } = req.body;

    if (!req.body || !full_name || !email || !password) {
      return res.status(400).json({
        error: "Hamma parametrlayni kiritish kerak: full_name, email, password",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: "Ushbu email tizimdan allaqachon ro'yxatdan o'tkazilgan",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at",
      [full_name, email, hashedPassword],
    );

    const newUser = result.rows[0];
    res.status(201).json({
      message: "Foydalanuvchi muvoffaqiyatli ro'yxatdan o'tkazildi",
      user: newUser,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).send("Kerakli parametrlarni berib yuborish kerak");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email va password majburiy",
      });
    }

    const result = await pool.query(
      "SELECT id, full_name, email, password, created_at FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Noto'g'ri email yoki password" });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Noto'g'ri email yoki passwor" });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "muvoffaqiyatli login",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Loginda xatolik:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
