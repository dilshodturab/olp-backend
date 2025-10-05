const express = require("express");
const cors = require("cors");
const { pool } = require("./config/db");
const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "https://udemy-uz.netlify.app",
];

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

const PORT = process.env.PORT || 5000;

const checkDbConnection = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await checkDbConnection();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();
