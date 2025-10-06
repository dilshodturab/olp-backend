const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .send("Hamma parametrlarni kiritish kerak: user_id, course_id");

    const { user_id, course_id } = req.body;

    if (!user_id || !course_id) {
      return res.status(400).json({
        error: "Hamma parametrlarni kiritish kerak: user_id, course_id",
      });
    }

    const existingData = await pool.query(
      `
      SELECT id 
      FROM bought_courses
      WHERE user_id = $1
      AND course_id = $2;
      `,
      [user_id, course_id],
    );

    if (existingData.rows.length > 0) {
      return res.sendStatus(204);
    }

    const userBalance = await pool.query(
      `
    SELECT balance
    FROM users 
    WHERE id = $1
    `,
      [user_id],
    );

    const coursePrice = await pool.query(
      `
    SELECT price 
    FROM courses 
    WHERE id = $1
    `,
      [course_id],
    );

    if (
      Number(userBalance.rows[0].balance) < Number(coursePrice.rows[0].price)
    ) {
      return res.status(402).json({
        message:
          "Kursni sotib olish uchun hisobingizda yetarli mablag' mavjud emas!",
      });
    }

    const bouthtCourse = await pool.query(
      `
      INSERT INTO bought_courses (user_id, course_id) VALUES($1, $2) RETURNING id;
      `,
      [user_id, course_id],
    );

    await pool.query(
      `
    UPDATE users
    SET balance = balance - $1
    WHERE id = $2;
    `,
      [coursePrice.rows[0].price, user_id],
    );

    res.status(201).json({
      message: "Kurs muvoffaqiyatli sotib olindi",
      data: bouthtCourse.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
