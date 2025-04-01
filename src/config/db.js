require("dotenv").config();
const { Pool } = require("pg");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT, // Default: 5432
// });
// pool.connect()
const pool = new Pool({

    connectionString:   `postgresql://zoodrop_owner:${process.env.neontechpass}@ep-rapid-flower-a5wzcahj-pooler.us-east-2.aws.neon.tech/${process.env.DB_NAME}?sslmode=require` ,
    ssl: { rejectUnauthorized: false } // Required for Neon.tech
})
pool.connect()
.then(()=> {console.log("postgresql connected")})
.catch((err)=> {console.log("database connection error", err)})

module.exports = pool