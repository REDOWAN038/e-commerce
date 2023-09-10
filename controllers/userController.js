const userModel = require("../models/userModel")
const JWT = require("jsonwebtoken")
const { hashPassword, comparePassword } = require("../helpers/authHelper")

// register a user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body
    const findUser = await userModel.findOne({ email })

    if (findUser) {
      return res.status(200).send({
        success: true,
        message: "already registered. please login",
      })
    }

    // register user
    const hashedPassword = await hashPassword(password)
    const user = await new userModel({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    }).save()

    res.status(201).send({
      success: true,
      message: "registration successful",
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in registration",
      error,
    })
  }
}

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invalid user credentials",
      })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not registered",
      })
    }

    const match = await comparePassword(password, user.password)

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "incorrect password",
      })
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.status(200).send({
      success: true,
      message: "login successful",
      user: {
        id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        mobile: user?.mobile,
        role: user?.role,
      },
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    })
  }
}

//get all users
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({})

    res.status(200).send({
      success: true,
      message: "User Lists",
      users,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting users",
    })
  }
}

module.exports = {
  createUser,
  loginUser,
  getAllUsersController,
}
