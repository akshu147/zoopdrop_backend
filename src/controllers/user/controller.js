const jwt = require('jsonwebtoken')
const pool = require('../../config/db')
const bcrypt = require('bcryptjs')
const { default: axios } = require('axios')
require('dotenv').config() // Load environment variables

// ✅ Create Table (Run once, then comment it out)
// const createTable = async () => {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS zoodrop_user (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         email VARCHAR(100) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL, -- Increased length for hashed password
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     console.log("Table created successfully");
//   } catch (err) {
//     console.error("Error creating table:", err);
//   }
// };
// createTable()

// ✅ User Registration
const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log(name, email, password)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const query = `
      INSERT INTO zoodrop_user (name, email, password)
      VALUES ($1, $2, $3) RETURNING *;
    `
    const data = [name, email, hashedPassword]

    await pool.query(query, data)
    res.status(201).json({ message: 'Signup successful' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Signup failed' })
  }
}

const userLogin = async (req, res) => {
  try {
    const { useremail, userpassword } = req.body // Changed to match database column

    // Check if user exists
    const query = 'SELECT * FROM zoodrop_user WHERE email = $1'
    const { rows } = await pool.query(query, [useremail])

    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not found' })
    }
    const user = rows[0]
    // Verify the password
    const isMatch = await bcrypt.compare(userpassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    // Generate JWT token
    const jwtstoredata = {
      userId: user.id,
      name: user.name,
      email: user.email
    }
    const token = jwt.sign(jwtstoredata, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    res.cookie('token', token, {
      httpOnly: true, // Secure, prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // True in production (HTTPS required)
      maxAge: 3600000, // 1 hour
      sameSite: 'Strict' // Prevents CSRF attacks
    })
    const verify = jwt.verify(token, process.env.JWT_SECRET)
    console.log('verify', verify)

    res.status(200).json({
      message: 'Successfully logged in',
      token
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
}

const getlocation = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, pickupLat, pickupLng, dropLat, dropLng, user_id } = req.body;

    if (!pickupLocation || !dropLocation || !pickupLat || !pickupLng || !dropLat || !dropLng || !user_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Insert data into your database
    const query = `
      INSERT INTO user_ride_history (pickup_address, drop_address, pickup_lat, pickup_lng, drop_lat, drop_lng, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [pickupLocation, dropLocation, pickupLat, pickupLng, dropLat, dropLng, user_id];
    const result = await pool.query(query, values);
    console.log('Inserted Data:', result.rows[0]);

    res.status(200).json({ message: 'Location added', data: result.rows[0] });
  } catch (err) {
    console.error('Error inserting location:', err);
    res.status(500).json({ message: 'Location insertion failed' });
  }
};

const calculatedistance = async (req, res) => {
  try {
    const bodydata = req.body;
    const userlocation = await pool.query(
      `SELECT * FROM user_ride_history`
    )

    // Check if the data exists
    if (userlocation.fields.length === 0) {
      return res.status(404).json({ message: "No ride history found for this ID" });
    }

    if (!process.env.placesapikey) {
      console.error("Google API key is missing!");
      return res.status(500).json({ message: "Server configuration error" });
    }

const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${bodydata.pickup_lat},${bodydata.pickup_lng}&destinations=${bodydata.drop_lat},${bodydata.drop_lng}&key=${process.env.placesapikey}`;
const responce = await axios.get(apiUrl)

    // Validate API response
    if (!responce.data.rows || responce.data.rows.length === 0 || !responce.data.rows[0].elements) {
      return res.status(500).json({ message: "Invalid response from Google API" });
    }

    const data = {
      distance: responce.data.rows[0].elements[0].distance.text,
      duration: responce.data.rows[0].elements[0].duration.text
    };
    console.log(data)

    res.status(200).json({ message: "Distance calculated", data:data});

  } catch (err) {
    console.error("Error in calculatedistance:", err.message);
    res.status(500).json({ message: "Matrix API error", error: err.message });
    console.log(err.message)
  }
};
const testing = (req, res)=> {
  try {
     const successful = "i love you sunil muskan"
    res.status(200).json({message:"sucess", data:successful})
  }
  catch(err) {
    res.status(500).json({message:"failedd"})
  }
}


const data = async () => {
  try {
   
   const query = await pool.query("select * from user_ride_history where user_id = $1", [8]);
    
   query.rows.map((value)=> {
      // console.log(value)
    })
  } catch (err) {

    console.error("Error fetching schema:", err);
  }
}

// data()

module.exports = { userRegister, userLogin, getlocation, calculatedistance , testing}
