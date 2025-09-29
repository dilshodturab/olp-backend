import express, { Request, Response } from "express";
import { pool } from "./db";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("OLP Backend is running 🚀");
});

app.get("/db-test", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("select now()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("DB error");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
