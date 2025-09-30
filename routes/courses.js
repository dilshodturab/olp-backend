const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("select * from courses");
    res.status(200).send(result.rows);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
module.exports = router;
