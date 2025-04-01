const pool = require('../config/db')

const createtable = async () => {
  try {
    const responce = await pool.query(
      `
      id SERIAL PRIMARY KEY,
      create table zoodrop(email varchar(50), 
      password varchar(50)),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      `
    )
    console.log("usertable created successfully")
  } catch (err) {
    console.log('something went wrong')
  }
}
createtable
