require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db'); // Import database pool correctly
const Allroutes = require('./src/app');
const cookieParser = require("cookie-parser");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api", Allroutes);
app.use(cookieParser());

// // Create Table if Not Exists
// const createTable = async () => {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS zoodrop (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(50) UNIQUE NOT NULL, 
//         password VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     console.log("✅ Table 'zoodrop' created successfully");
//   } catch (err) {
//     console.error("❌ Error creating table:", err.message);
//   }
// };
// createTable();

app.listen(process.env.serverport, () => {
  console.log(`🚀 Server running on port ${process.env.serverport}`);
});
