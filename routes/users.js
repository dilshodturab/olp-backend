const express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("../config/db");
const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Foydalanuvchini ro'yxatdan o'tkazish
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: Foydalanuvchining to'liq ismi
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Foydalanuvchining email manzili
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Foydalanuvchining paroli
 *     responses:
 *       201:
 *         description: Foydalanuvchi muvoffaqiyatli ro'yxatdan o'tkazildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Noto'g'ri so'rov parametrlari
 *       409:
 *         description: Foydalanuvchi allaqachon mavjud
 *       500:
 *         description: Server xatosi
 */
router.post("/register", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).send("kerakli parametrlarni berib yuborish kerak");

    const { full_name, email, password } = req.body;

    if (!req.body || !full_name || !email || !password) {
      return res.status(400).json({
        error: "Hamma parametrlarni kiritish kerak: full_name, email, password",
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Foydalanuvchini tizimga kiritish
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Foydalanuvchining email manzili
 *               password:
 *                 type: string
 *                 description: Foydalanuvchining paroli
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     balance:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Noto'g'ri so'rov parametrlari
 *       401:
 *         description: Noto'g'ri email yoki password
 *       500:
 *         description: Server xatosi
 */
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
      "SELECT id, full_name, email, balance, password, created_at FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Noto'g'ri email yoki password" });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Noto'g'ri email yoki password" });
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
