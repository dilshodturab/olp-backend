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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: "Hamma parametrlarni kiritish kerak: user_id",
      });
    }

    const result = await pool.query(
      `
        SELECT 
          c.id,
          c.course_name,
          c.thumbnail_url,
          c.price,
          u.full_name AS author,
          COALESCE(ROUND(AVG(cr.rating), 2), 0) AS average_rating,
          EXISTS(SELECT 1 FROM cart ca WHERE ca.course_id = c.id AND ca.user_id = $1) as "isInCart",
          EXISTS(SELECT 1 FROM bought_courses b WHERE b.course_id = c.id AND b.user_id = $1) as "isBought"
        FROM favorites f
        JOIN courses c ON c.id = f.course_id
        JOIN users u ON u.id = c.author
        LEFT JOIN course_ratings cr ON f.course_id = cr.course_id
        WHERE f.user_id = $1
        GROUP BY c.id, u.full_name, c.course_name, c.thumbnail_url, c.price ;
    `,
      [id],
    );
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
