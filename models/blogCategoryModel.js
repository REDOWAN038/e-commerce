const mongoose = require("mongoose")
const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
)

//Export the model
module.exports = mongoose.model("BlogCategory", blogCategorySchema)
