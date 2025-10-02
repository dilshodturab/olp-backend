const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = ["http://localhost:4200", "htps://udemy-uz.netlify.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowd by CORS"));
    }
  },
};
app.use(cors(corsOptions));

require("./config/routes")(app);

app.get("/", async (req, res) => {
  res.status(200).send("OLP api ishlayapti!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
