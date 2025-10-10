const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        cr.id,
        u.full_name,
        cr.review,
        cr.rating
      FROM course_ratings cr 
      JOIN users u ON u.id = cr.user_id
      WHERE cr.course_id = $1;
    `,
      [id],
    );
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const { user_id, course_id, rating, review } = req.body;
    if (!req.body) {
      return res
        .status(400)
        .send(
          "Kerakli parametrlar: user_id:number, course_id:number, rating:number, review:string",
        );
    }

    if (!user_id && !course_id && (!rating || !review)) {
      return res.status(400).json({
        error:
          "Kerakli parametrlar: user_id:number, course_id:number, rating:number, review:string",
      });
    }

    const insertedData = await pool.query(
      `
        INSERT INTO course_ratings (user_id, course_id, rating, review)
        VALUES ($1, $2, $3, $4) RETURNING id, created_at;
        `,
      [user_id, course_id, rating, review],
    );

    res.status(201).json({
      message: "Review muvoffaqiyatli saqlandi!",
      data: insertedData.rows[0],
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
module.exports = router;
