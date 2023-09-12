const express = require("express")
const {
  createUser,
  loginUser,
  getAllUsersController,
  getSingleUserController,
  deleteUserController,
  updateUserController,
  blockUserController,
  unblockUserController,
  handleRefreshToken,
  handleLogoutController,
} = require("../controllers/userController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
//const { requireSignIn } = require("../middlewares/authMiddleware")
const router = express.Router()

//register user
router.post("/register", createUser)

// login user
router.post("/login", loginUser)

// refresh token
router.get("/refresh", handleRefreshToken)

//logout
router.get("/logout", handleLogoutController)

// get all users
router.get("/all-users", getAllUsersController)

// get single user
router.get("/single-user", requireSignIn, getSingleUserController)

//delete user
router.delete("/delete-user", requireSignIn, deleteUserController)

// update user
router.put("/update-user", requireSignIn, updateUserController)

// block user
router.put("/block-user/:id", requireSignIn, isAdmin, blockUserController)

// unblock user
router.put("/unblock-user/:id", requireSignIn, isAdmin, unblockUserController)

module.exports = router
