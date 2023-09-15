const express = require("express")
const {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getSingleCategoryController,
  getAllCategoryController,
} = require("../controllers/blogCategoryController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

// create category
router.post("/", requireSignIn, isAdmin, createCategoryController)

// update category
router.put("/:id", requireSignIn, isAdmin, updateCategoryController)

// delete category
router.delete("/:id", requireSignIn, isAdmin, deleteCategoryController)

// get all category
router.get("/all-category", getAllCategoryController)

// get single category
router.get("/:id", getSingleCategoryController)

module.exports = router
