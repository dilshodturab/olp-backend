const express = require("express");
const app = express();

require("./config/routes")(app);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
