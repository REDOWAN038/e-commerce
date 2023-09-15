const brandModel = require("../models/brandModel")

// creating new brand
const createBrandController = async (req, res) => {
  try {
    const { title } = req.body
    const findBrand = await brandModel.findOne({ title })
    if (findBrand) {
      return res.status(201).send({
        success: true,
        message: "brand already exists",
        findBrand,
      })
    }
    const newBrand = await brandModel.create(req.body)
    res.status(200).send({
      success: true,
      message: "brand created successfully",
      newBrand,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in creating brand",
      error,
    })
  }
}

// updating brand
const updateBrandController = async (req, res) => {
  try {
    const { id } = req.params
    const findBrand = await brandModel.findById(id)
    if (!findBrand) {
      return res.status(404).send({
        success: false,
        message: "brand does not exists",
      })
    }

    const updatedBrand = await brandModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.status(200).send({
      success: true,
      message: "brand updated successfully",
      updatedBrand,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in updating brand",
      error,
    })
  }
}

// delete brand
const deleteBrandController = async (req, res) => {
  try {
    const { id } = req.params
    const findBrand = await brandModel.findById(id)
    if (!findBrand) {
      return res.status(404).send({
        success: false,
        message: "brand does not exists",
      })
    }

    const deleteBrand = await brandModel.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: "brand deleted successfully",
      deleteBrand,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in deleting brand",
      error,
    })
  }
}

// get single brand
const getSingleBrandController = async (req, res) => {
  try {
    const { id } = req.params
    const findBrand = await brandModel.findById(id)
    if (!findBrand) {
      return res.status(404).send({
        success: false,
        message: "brand does not exists",
      })
    }

    res.status(200).send({
      success: true,
      message: "get brand",
      findBrand,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting single brand",
      error,
    })
  }
}

// get all brand
const getAllBrandController = async (req, res) => {
  try {
    const allBrand = await brandModel.find({})
    res.status(200).send({
      success: true,
      message: "all brand",
      allBrand,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting all brand",
      error,
    })
  }
}

module.exports = {
  createBrandController,
  updateBrandController,
  deleteBrandController,
  getSingleBrandController,
  getAllBrandController,
}
