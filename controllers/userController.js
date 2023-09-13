const userModel = require("../models/userModel")
const JWT = require("jsonwebtoken")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const {
  hashPassword,
  comparePassword,
  passwordResetToken,
} = require("../helpers/authHelper")
const validateId = require("../utils/validateId")
const { refreshToken } = require("../config/refreshToken")
const { generateToken } = require("../config/generateToken")

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
    const token = await generateToken(user?._id)

    // refresh token
    const rToken = await refreshToken(user?._id)

    const updateUser = await userModel.findByIdAndUpdate(
      user?._id,
      { refreshToken: rToken },
      { new: true }
    )

    res.cookie("refreshToken", rToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
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

// handle refresh token
const handleRefreshToken = async (req, res) => {
  try {
    const cookie = req.cookies
    if (!cookie?.refreshToken) {
      return res.status(404).send({
        success: false,
        message: "no refresh token",
      })
    }

    const rToken = cookie?.refreshToken
    const user = await userModel.findOne({ refreshToken: rToken })

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "no user have this refresh token",
      })
    }

    const decode = JWT.verify(rToken, process.env.JWT_SECRET)

    console.log("user : ", user?._id)
    console.log("decode : ", decode?.id)

    if (user._id != decode.id) {
      return res.status(400).send({
        success: false,
        message: "something went wrong in refresh token",
      })
    }

    const token = await generateToken(user?._id)

    res.status(200).send({
      success: true,
      message: "refresh token validated",
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
      message: "error in handle refresh token",
      error,
    })
  }
}

// logout
const handleLogoutController = async (req, res) => {
  try {
    const cookie = req.cookies

    if (!cookie?.refreshToken) {
      return res.status(404).send({
        success: false,
        message: "no refresh token",
      })
    }

    const rToken = cookie?.refreshToken
    const user = await userModel.findOne({ refreshToken: rToken })

    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      })
      return res.status(204).send({
        success: false,
        message: "204 forbidden",
      })
    }

    const filter = { refreshToken: rToken }
    await userModel.findOneAndUpdate(filter, {
      refreshToken: "",
    })

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    })

    res.status(200).send({
      success: true,
      message: "logout successful",
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "error while loging out",
      error,
    })
  }
}

//update user
const updateUserController = async (req, res) => {
  try {
    const { firstName, lastName, password, mobile } = req.body
    validateId(req.user.id)

    const user = await userModel.findById(req.user.id)

    const hashedPassword = password ? await hashPassword(password) : undefined
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
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
    validateId(req.user.id)
    const user = await userModel.findById(req.user.id)

    // if (!user) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "not registered",
    //   })
    // }

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

    validateId(req.user.id)
    // Find the user to be deleted
    const user = await userModel.findById(req.user.id)

    // if (!user) {
    //   return res
    //     .status(404)
    //     .send({ success: false, message: "user not registered" })
    // }

    // Delete the user
    await userModel.findByIdAndDelete(req.user.id)

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
    validateId(req.user.id)
    const user = await userModel.findById(id)

    // if (!user) {
    //   return res.status(404).send({
    //     success: false,
    //     message: "not registered",
    //   })
    // }

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

const updatePasswordController = async (req, res) => {
  //const { _id } = req.user
  const { password } = req.body
  const user = await userModel.findById(req.user.id)

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "not registered",
    })
  }

  if (password) {
    const hashedPassword = await hashPassword(password)
    const resetToken = await passwordResetToken()
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")
    user.password = hashedPassword
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000
    const updatedPasswordUser = await user.save()

    res.status(200).send({
      success: true,
      message: "password updated successfully",
      updatedPasswordUser,
    })
  } else {
    res.status(404).send({
      success: false,
      message: "please provide password to update",
    })
  }
}

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(404).send({
        success: false,
        message: "please provide your email",
      })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not registered",
      })
    }

    const resetToken = await passwordResetToken()
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000
    await user.save()

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: email, // list of receivers
      subject: "Reset Your Password",
      text: `http://localhost:8080/api/v1/user/reset-password/${resetToken}`,
    })

    res.status(200).send({
      success: true,
      resetToken,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error in forgot password route",
      error,
    })
  }
}

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "token expired... try again",
      })
    }

    user.password = await hashPassword(password)
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.status(200).send({
      success: true,
      message: "Password Reset SUccessful",
      user,
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
      success: false,
      message: "Error WHile Resetting Password",
      error,
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
  handleRefreshToken,
  handleLogoutController,
  updatePasswordController,
  forgotPasswordController,
  resetPasswordController,
}
