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
  updatePasswordController,
  forgotPasswordController,
  resetPasswordController,
  loginAdmin,
  getWishListController,
  saveAddressController,
  addCartController,
  getCartController,
  emptyCartController,
  applyCouponController,
  createOrderController,
  getOrdersController,
  updateOrderStatusController,
} = require("../controllers/userController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
//const { requireSignIn } = require("../middlewares/authMiddleware")
const router = express.Router()

//register user
router.post("/register", createUser)

// login user
router.post("/login", loginUser)

// login admin
router.post("/admin-login", loginAdmin)

//get wishlist
router.get("/wishlist", requireSignIn, getWishListController)

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

// save address
router.put("/save-address", requireSignIn, saveAddressController)

// update password
router.put("/update-password", requireSignIn, updatePasswordController)

// forgot password
router.post("/forgot-password", forgotPasswordController)

// add cart
router.post("/add-cart", requireSignIn, addCartController)

// get cart
router.get("/get-cart", requireSignIn, getCartController)

// get order
router.get("/get-order", requireSignIn, getOrdersController)

// get cart
router.delete("/empty-cart", requireSignIn, emptyCartController)

// get cart
router.post("/cart/apply-coupon", requireSignIn, applyCouponController)

// create order
router.post("/cart/cash-order", requireSignIn, createOrderController)

// reset password
router.put("/reset-password/:token", resetPasswordController)

// update order status
router.put(
  "/order/update-status/:id",
  requireSignIn,
  isAdmin,
  updateOrderStatusController
)

// block user
router.put("/block-user/:id", requireSignIn, isAdmin, blockUserController)

// unblock user
router.put("/unblock-user/:id", requireSignIn, isAdmin, unblockUserController)

module.exports = router
