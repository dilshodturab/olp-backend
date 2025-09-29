const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.status(200).send("This is users route");
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = router;
