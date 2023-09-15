const categoryModel = require("../models/blogCategoryModel")

// creating new category
const createCategoryController = async (req, res) => {
  try {
    const { title } = req.body
    const findCategory = await categoryModel.findOne({ title })
    if (findCategory) {
      return res.status(201).send({
        success: true,
        message: "category already exists",
        findCategory,
      })
    }
    const newCategory = await categoryModel.create(req.body)
    res.status(200).send({
      success: true,
      message: "category created successfully",
      newCategory,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in creating category",
      error,
    })
  }
}

// updating category
const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params
    const findCategory = await categoryModel.findById(id)
    if (!findCategory) {
      return res.status(404).send({
        success: false,
        message: "category does not exists",
      })
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )
    res.status(200).send({
      success: true,
      message: "category updated successfully",
      updatedCategory,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in updating category",
      error,
    })
  }
}

// delete category
const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params
    const findCategory = await categoryModel.findById(id)
    if (!findCategory) {
      return res.status(404).send({
        success: false,
        message: "category does not exists",
      })
    }

    const deleteCategory = await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: "category deleted successfully",
      deleteCategory,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in deleting category",
      error,
    })
  }
}

// get single category
const getSingleCategoryController = async (req, res) => {
  try {
    const { id } = req.params
    const findCategory = await categoryModel.findById(id)
    if (!findCategory) {
      return res.status(404).send({
        success: false,
        message: "category does not exists",
      })
    }

    res.status(200).send({
      success: true,
      message: "get category",
      findCategory,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting single category",
      error,
    })
  }
}

// get all category
const getAllCategoryController = async (req, res) => {
  try {
    const allCategory = await categoryModel.find({})
    res.status(200).send({
      success: true,
      message: "all category",
      allCategory,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting all category",
      error,
    })
  }
}

module.exports = {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getSingleCategoryController,
  getAllCategoryController,
}
