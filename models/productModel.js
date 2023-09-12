const mongoose = require("mongoose")
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    // },
    brand: {
      type: String,
      required: true,
      //enum: ["Apple", "Samsung", "Lenovo"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    // images: [
    //   {
    //     public_id: String,
    //     url: String,
    //   },
    // ],
    color: {
      type: String,
      required: true,
      //enum: ["Black", "Brown", "Red"],
    },
    ratings: [
      {
        star: Number,
        //comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    // totalrating: {
    //   type: String,
    //   default: 0,
    // },
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model("Product", productSchema)
