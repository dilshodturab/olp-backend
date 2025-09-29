import { Pool } from "pg";

export const pool = new Pool({
  user: "olpuser",
  host: "localhost",
  database: "olpdb",
  password: "olppassword",
  port: 5432,
});
