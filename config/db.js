const { Pool } = require("pg");

const pool = new Pool({
  user: "olpuser",
  host: "localhost",
  database: "olpdb",
  password: "olppassword",
  port: 5432,
});

module.exports = { pool };
