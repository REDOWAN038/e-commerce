const colorModel = require("../models/colorModel")

// creating new color
const createColorController = async (req, res) => {
  try {
    const { title } = req.body
    const findColor = await colorModel.findOne({ title })
    if (findColor) {
      return res.status(201).send({
        success: true,
        message: "color already exists",
        findColor,
      })
    }
    const newColor = await colorModel.create(req.body)
    res.status(200).send({
      success: true,
      message: "color created successfully",
      newColor,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in creating color",
      error,
    })
  }
}

// updating color
const updateColorController = async (req, res) => {
  try {
    const { id } = req.params
    const findColor = await colorModel.findById(id)
    if (!findColor) {
      return res.status(404).send({
        success: false,
        message: "color does not exists",
      })
    }

    const updatedColor = await colorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.status(200).send({
      success: true,
      message: "color updated successfully",
      updatedColor,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in updating color",
      error,
    })
  }
}

// delete color
const deleteColorController = async (req, res) => {
  try {
    const { id } = req.params
    const findColor = await colorModel.findById(id)
    if (!findColor) {
      return res.status(404).send({
        success: false,
        message: "color does not exists",
      })
    }

    const deleteColor = await colorModel.findByIdAndDelete(id)
    res.status(200).send({
      success: true,
      message: "color deleted successfully",
      deleteColor,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in deleting color",
      error,
    })
  }
}

// get single color
const getSingleColorController = async (req, res) => {
  try {
    const { id } = req.params
    const findColor = await colorModel.findById(id)
    if (!findColor) {
      return res.status(404).send({
        success: false,
        message: "color does not exists",
      })
    }

    res.status(200).send({
      success: true,
      message: "get color",
      findColor,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting single color",
      error,
    })
  }
}

// get all color
const getAllColorController = async (req, res) => {
  try {
    const allColor = await colorModel.find({})
    res.status(200).send({
      success: true,
      message: "all color",
      allColor,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in getting all color",
      error,
    })
  }
}

module.exports = {
  createColorController,
  updateColorController,
  deleteColorController,
  getSingleColorController,
  getAllColorController,
}
