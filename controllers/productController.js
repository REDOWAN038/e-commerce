const productModel = require("../models/productModel")
const slugify = require("slugify")
const validateId = require("../utils/validateId")

const createProductController = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const newProduct = await productModel.create(req.body)
    res.status(200).send({
      success: true,
      message: "product created successfully",
      newProduct,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in creating product",
      error,
    })
  }
}

// update product
const updateProductController = async (req, res) => {
  try {
    const { id } = req.params

    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })

    res.status(200).send({
      success: true,
      message: "product updated successfully",
      updatedProduct,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in updating product",
      error,
    })
  }
}

// delete product
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params
    await productModel.findOneAndDelete(id)
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in deleting product",
      error,
    })
  }
}

// fetch single product
const fetchSingleProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await productModel.findById(id)

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "no product found",
      })
    }

    res.status(200).send({
      success: true,
      message: "product found",
      product,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while fetching a product",
      error,
    })
  }
}

//fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query }
    const excludeFields = ["page", "sort", "limit", "fields"]
    excludeFields.forEach((el) => delete queryObj[el])
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = productModel.find(JSON.parse(queryStr))

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }

    // pagination

    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    if (req.query.page) {
      const productCount = await productModel.countDocuments()
      if (skip >= productCount) {
        return res.status(404).send({
          success: true,
          message: "page does not exists",
        })
      }
    }

    const products = await query
    res.status(200).send({
      success: true,
      message: "all products",
      products,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while fetching a product",
      error,
    })
  }
}

module.exports = {
  createProductController,
  fetchAllProducts,
  fetchSingleProduct,
  updateProductController,
  deleteProductController,
}
