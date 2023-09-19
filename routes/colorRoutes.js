const express = require("express")
const {
  createColorController,
  updateColorController,
  deleteColorController,
  getSingleColorController,
  getAllColorController,
} = require("../controllers/colorController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()

// create Color
router.post("/", requireSignIn, isAdmin, createColorController)

// update Color
router.put("/:id", requireSignIn, isAdmin, updateColorController)

// delete Color
router.delete("/:id", requireSignIn, isAdmin, deleteColorController)

// get all Color
router.get("/all-color", getAllColorController)

// get single Color
router.get("/:id", getSingleColorController)

module.exports = router
