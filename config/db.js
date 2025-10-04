const { Pool } = require('pg');

const localConfig = {
    user: 'olpuser',
    host: 'localhost',
    database: 'olpdb',
    password: 'olppassword',
    port: 5432,
};

const productionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
}

const pool = new Pool(process.env.NODE_ENV === 'production' ? productionConfig : localConfig);

module.exports = { pool };
