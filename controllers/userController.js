const userModel = require("../models/userModel")
const JWT = require("jsonwebtoken")
const { hashPassword, comparePassword } = require("../helpers/authHelper")

// register a user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body

    //validations
    if (!firstName) {
      return res.send({ message: "first name is required" })
    }

    if (!lastName) {
      return res.send({ message: "last name is required" })
    }

    if (!email) {
      return res.send({ message: "email is required" })
    }

    if (!password) {
      return res.send({ message: "password is required" })
    }

    if (!mobile) {
      return res.send({ message: "phone is required" })
    }

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

//update user
const updateUserController = async (req, res) => {
  try {
    const { firstName, lastName, password, mobile } = req.body
    const user = await userModel.findById(req.user._id)

    const hashedPassword = password ? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        firstName: firstName || user?.firstName,
        lastName: lastName || user?.lastName,
        password: hashedPassword || user?.password,
        mobile: mobile || user?.mobile,
      },
      { new: true }
    )
    res.status(200).send({
      success: true,
      message: "User Profile Updated SUccessfully",
      updatedUser,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
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

// get single user
const getSingleUserController = async (req, res) => {
  try {
    //const { id } = req.params
    const user = await userModel.findById(req.user._id)

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not registered",
      })
    }

    res.status(200).send({
      success: true,
      message: "single user info",
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting single user",
    })
  }
}

//delete user
const deleteUserController = async (req, res) => {
  try {
    //const { id } = req.params

    // Find the user to be deleted
    const user = await userModel.findById(req.user._id)

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user not registered" })
    }

    // Delete the user
    await userModel.findByIdAndDelete(req.user._id)

    res.status(200).send({
      success: true,
      message: "user deleted",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting user",
    })
  }
}

// block user
const blockUserController = async (req, res) => {
  try {
    const { id } = req.params
    const user = await userModel.findById(id)

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not registered",
      })
    }

    const blockUser = await userModel.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    )

    res.status(200).send({
      success: true,
      message: "User Blocked SUccessfully",
      blockUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while blocking user",
    })
  }
}

// unblock user
const unblockUserController = async (req, res) => {
  try {
    const { id } = req.params
    const user = await userModel.findById(id)

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not registered",
      })
    }

    const unblockUser = await userModel.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    )

    res.status(200).send({
      success: true,
      message: "User Unblocked SUccessfully",
      unblockUser,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      error,
      message: "Error while unblocking user",
    })
  }
}

module.exports = {
  createUser,
  loginUser,
  getAllUsersController,
  getSingleUserController,
  deleteUserController,
  updateUserController,
  blockUserController,
  unblockUserController,
}
