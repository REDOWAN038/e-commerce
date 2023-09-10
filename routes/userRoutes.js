const express = require("express")
const {
  createUser,
  loginUser,
  getAllUsersController,
} = require("../controllers/userController")
const router = express.Router()

//register user
router.post("/register", createUser)

// login user
router.post("/login", loginUser)

// get all users
router.get("/all-users", getAllUsersController)

module.exports = router
