const express = require("express")
const {
  createProductController,
  fetchSingleProduct,
  fetchAllProducts,
  updateProductController,
  deleteProductController,
  addToWishlistController,
  ratingProductController,
} = require("../controllers/productController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

// create product
router.post("/create-product", requireSignIn, isAdmin, createProductController)

// fetch all products
router.get("/all-products", fetchAllProducts)

// fetch single product
router.get("/:id", fetchSingleProduct)

// add to wishlist
router.put("/wishlist", requireSignIn, addToWishlistController)

// rating product
router.put("/rating", requireSignIn, ratingProductController)

// update product
router.put("/:id", requireSignIn, isAdmin, updateProductController)

// delete product
router.delete("/:id", requireSignIn, isAdmin, deleteProductController)

module.exports = router
