const blogModel = require("../models/blogModel")
const userModel = require("../models/userModel")
const validateId = require("../utils/validateId")
const fs = require("fs")
const cloudinaryUploadImg = require("../utils/cloudinary")

const createBlogController = async (req, res) => {
  try {
    const newBlog = await blogModel.create(req.body)
    res.status(200).send({
      success: true,
      message: "blog created",
      newBlog,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Creating Blog",
      error,
    })
  }
}

const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params
    const updatedBlog = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.status(200).send({
      success: true,
      message: "blog updated",
      updatedBlog,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Creating Blog",
      error,
    })
  }
}

const getBlogController = async (req, res) => {
  try {
    const { id } = req.params
    validateId(id)
    const blog = await blogModel
      .findById(id)
      .populate("likes")
      .populate("dislikes")
    const updatedViews = await blogModel.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      {
        new: true,
      }
    )
    res.status(200).send({
      success: true,
      message: "get blog and increse view",
      blog,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Creating Blog",
      error,
    })
  }
}

const getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({})
    res.status(200).send({
      success: true,
      message: "all blogs",
      blogs,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Getting All Blogs",
      error,
    })
  }
}

// delete blog
const deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params
    const blog = await blogModel.findByIdAndDelete(id)
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blog not available",
      })
    }
    res.status(200).send({
      success: true,
      message: "blog deleted",
      blog,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error WHile Getting All Blogs",
      error,
    })
  }
}

const likeBlogController = async (req, res) => {
  try {
    const { blogId } = req.body
    validateId(blogId)
    // Find the blog which you want to be liked
    const blog = await blogModel.findById(blogId)
    // find the login user
    const loginUserId = req?.user?.id
    // find if the user has liked the blog
    const isLiked = blog?.isLiked
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    )
    if (alreadyDisliked) {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      )
      res.status(200).send({
        success: true,
        blog,
      })
    }
    if (isLiked) {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      )
      res.status(200).send({
        success: true,
        blog,
      })
    } else {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      )
      res.status(200).send({
        success: true,
        blog,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in like blog",
      error,
    })
  }
}

const dislikeBlogController = async (req, res) => {
  try {
    const { blogId } = req.body
    validateId(blogId)
    // Find the blog which you want to be liked
    const blog = await blogModel.findById(blogId)
    // find the login user
    const loginUserId = req?.user?.id
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    )
    if (alreadyLiked) {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      )
      res.status(200).send({
        success: true,
        blog,
      })
    }
    if (isDisLiked) {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      )
      res.status(200).send({
        success: true,
        blog,
      })
    } else {
      const blog = await blogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      )
      res.status(200).send({
        success: true,
        blog,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in dislike blog",
      error,
    })
  }
}

const uploadImages = async (req, res) => {
  try {
    const { id } = req.params
    const blog = await blogModel.findById(id)
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blog not found",
      })
    }
    const uploader = (path) => cloudinaryUploadImg(path, "images")
    const urls = []
    const files = req.files
    for (const file of files) {
      const { path } = file
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }
    console.log(req.files)
    const findBlog = await blogModel.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file
        }),
      },
      {
        new: true,
      }
    )
    res.status(200).send({
      success: true,
      message: "upload blog image",
      findBlog,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in blog upload image",
      error,
    })
  }
}

module.exports = {
  createBlogController,
  updateBlogController,
  getBlogController,
  getAllBlogsController,
  deleteBlogController,
  likeBlogController,
  dislikeBlogController,
  uploadImages,
}
