const couponModel = require("../models/couponModel")

// create coupon
const createCouponController = async (req, res) => {
  try {
    const newCoupon = await couponModel.create(req.body)
    res.status(200).send({
      success: true,
      message: "coupon created",
      newCoupon,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in creating coupon",
      error,
    })
  }
}

// get all coupon
const getAllCouponController = async (req, res) => {
  try {
    const coupons = await couponModel.find({})
    res.status(200).send({
      success: true,
      message: "all coupons",
      coupons,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting all coupon",
      error,
    })
  }
}

// update coupon
const updateCouponController = async (req, res) => {
  try {
    const { id } = req.params
    const coupon = couponModel.findById(id)
    if (!coupon) {
      return res.status(404).send({
        success: false,
        message: "coupon not available",
      })
    }

    const updateCoupon = await couponModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.status(200).send({
      success: true,
      message: "update coupon",
      updateCoupon,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in updating coupon",
      error,
    })
  }
}

// delete coupon
const deleteCouponController = async (req, res) => {
  try {
    const { id } = req.params
    const coupon = couponModel.findById(id)
    if (!coupon) {
      return res.status(404).send({
        success: false,
        message: "coupon not available",
      })
    }

    const deleteCoupon = await couponModel.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: "delete coupon",
      deleteCoupon,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in updating coupon",
      error,
    })
  }
}

module.exports = {
  createCouponController,
  getAllCouponController,
  updateCouponController,
  deleteCouponController,
}
