const express = require("express")
const { userRegister, userLogin, getlocation, calculatedistance, testing } = require("../../controllers/controllers")
const userRoutes = express.Router()
userRoutes.post("/sign-up", userRegister)
userRoutes.post("/log-in", userLogin)
userRoutes.post("/getlocation", getlocation)
userRoutes.post("/distance-matrix", calculatedistance)
userRoutes.get("/test", testing)
module.exports = userRoutes