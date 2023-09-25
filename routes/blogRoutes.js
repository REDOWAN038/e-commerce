const express = require("express")
const {
  createBlogController,
  updateBlogController,
  getBlogController,
  getAllBlogsController,
  deleteBlogController,
  likeBlogController,
  dislikeBlogController,
  uploadImages,
} = require("../controllers/blogController")
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware")
const { blogImgResize, uploadPhoto } = require("../middlewares/uploadImage")
const router = express.Router()

// create blog
router.post("/create-blog", requireSignIn, isAdmin, createBlogController)

//upload images
router.put(
  "/upload-image",
  requireSignIn,
  isAdmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  uploadImages
)

// like blog
router.put("/like-blog", requireSignIn, likeBlogController)

// dislike blog
router.put("/dislike-blog", requireSignIn, dislikeBlogController)

// updated blog
router.put("/update-blog/:id", requireSignIn, isAdmin, updateBlogController)

// get blog
router.get("/get-blog/:id", getBlogController)

// get all blogs
router.get("/all-blogs", getAllBlogsController)

// delete blog
router.delete("/delete-blog/:id", requireSignIn, isAdmin, deleteBlogController)

module.exports = router
