const express = require("express");
const cors = require("cors");
const { pool } = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:4200", "https://0lp.netlify.app"];

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "OLP backend",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./index.js", "./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
  res.status(200).send(
    `<p>Bu OLP - Online Learning Platform backend serveri. Siz frontend qismiga o'tishingiz kerak</p>
      <a href='https://0lp.netlify.app'> OLP fronti ga o'tish</a>`,
  );
});

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
