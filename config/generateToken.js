const JWT = require("jsonwebtoken")

const generateToken = async (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })
}

module.exports = { generateToken }
