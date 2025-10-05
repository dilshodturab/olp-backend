const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (!req.body)
      return res.status(400).send("kerakli parametrlarni berib yuborish kerak");

    const { user_id, course_id } = req.body;

    if (!user_id || !course_id) {
      return res.status(400).json({
        error: "Hamma parametrlarni kiritish kerak: user_id, course_id",
      });
    }

    const existingData = await pool.query(
      `
      SELECT id 
      FROM favorites 
      WHERE user_id = $1
      AND course_id = $2;
      `,
      [user_id, course_id],
    );

    if (existingData.rows.length > 0) {
      await pool.query(
        `
       DELETE FROM favorites WHERE user_id = $1 AND course_id = $2; 
      `,
        [user_id, course_id],
      );
      return res.sendStatus(204);
    }

    const insertedData = await pool.query(
      `
      INSERT INTO favorites (user_id, course_id) VALUES($1, $2) RETURNING id;
      `,
      [user_id, course_id],
    );

    res.status(201).json({
      message: "Favoritesga muvoffaqiyatli qo'shildi",
      data: insertedData.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
