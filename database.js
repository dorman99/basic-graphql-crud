require("dotenv").config();
const Pool = require("pg-pool");
let pool = new Pool({
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABSE_USER,
    password: process.env.DATABASE_PASSWORD
});

module.exports = pool;