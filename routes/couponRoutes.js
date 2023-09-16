const express = require("express")
const {
  createCouponController,
  getAllCouponController,
  updateCouponController,
  deleteCouponController,
} = require("../controllers/couponController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

// create coupon
router.post("/", requireSignIn, isAdmin, createCouponController)

// get all coupons
router.get("/", requireSignIn, getAllCouponController)

// update coupon
router.put("/:id", requireSignIn, isAdmin, updateCouponController)

// delete coupon
router.delete("/:id", requireSignIn, isAdmin, deleteCouponController)

module.exports = router
