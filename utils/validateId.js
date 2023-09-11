const mongoose = require("mongoose")

const validateId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id)
  if (!isValid) {
    return res.status(404).send({
      success: false,
      message: "wrong id",
    })
  }
}

module.exports = validateId
