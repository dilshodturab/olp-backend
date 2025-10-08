const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
     SELECT
        c.id,
        c.course_name,
        c.thumbnail_url,
        c.price,
        u.full_name AS author,
        COALESCE(ROUND(AVG(cr.rating), 2), 0) as average_rating
      FROM
        courses c
      JOIN
        users u ON c.author = u.id
      LEFT JOIN course_ratings cr ON c.id = cr.course_id
      GROUP BY c.id, u.id, c.course_name, c.thumbnail_url, c.price, u.full_name, c.created_at 
      ORDER BY c.created_at;      `,
    );
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const result = await pool.query(
      `
        SELECT
          c.id,
          c.course_name,
          c.description,
          c.thumbnail_url,
          c.video_url,
          c.price,
          u.full_name AS author,
          COALESCE(ROUND(AVG(cr.rating), 2), 0) AS average_rating,
          EXISTS(SELECT 1 FROM favorites f WHERE f.course_id = c.id AND f.user_id = $2) as "isFavorite",
          EXISTS(SELECT 1 FROM cart ca WHERE ca.course_id = c.id AND ca.user_id = $2) as "isInCart"
        FROM courses c
        JOIN users u ON c.author = u.id
        LEFT JOIN course_ratings cr ON c.id = cr.course_id
        WHERE c.id = $1
        GROUP BY c.id, u.full_name, c.course_name, c.description, c.thumbnail_url, c.video_url, c.price;
    `,
      [id, user_id],
    );
    res.status(200).send(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
module.exports = router;
