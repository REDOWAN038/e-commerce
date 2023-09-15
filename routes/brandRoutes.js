const express = require("express")
const {
  createBrandController,
  updateBrandController,
  deleteBrandController,
  getSingleBrandController,
  getAllBrandController,
} = require("../controllers/brandController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

// create Brand
router.post("/", requireSignIn, isAdmin, createBrandController)

// update Brand
router.put("/:id", requireSignIn, isAdmin, updateBrandController)

// delete Brand
router.delete("/:id", requireSignIn, isAdmin, deleteBrandController)

// get all Brand
router.get("/all-brand", getAllBrandController)

// get single Brand
router.get("/:id", getSingleBrandController)

module.exports = router
