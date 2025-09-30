const express = require("express");
const app = express();

require("./config/routes")(app);

app.get("/", async (req, res) => {
  res.status(200).send("OLP api ishlayapti!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
