const JWT = require("jsonwebtoken")

const refreshToken = (id) => {
  const token = JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  })
  return token
}

module.exports = { refreshToken }
