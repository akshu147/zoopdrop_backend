const express = require("express");
const userRoutes = require("./routes/user/user");
const Allroutes = express.Router()
Allroutes.use("/user",userRoutes)
module.exports = Allroutes;