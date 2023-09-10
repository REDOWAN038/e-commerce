const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(v)
        },
        message: "Invalid email address.",
      },
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{11}$/.test(v)
        },
        message: "Mobile number must be exactly 11 digits.",
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      enum: [0, 1], // 0 --> user, 1-->admin
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
