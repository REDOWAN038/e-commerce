const bcrypt = require("bcrypt")
const crypto = require("crypto")

const hashPassword = async (password) => {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  } catch (error) {
    console.log(error)
  }
}

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

const passwordResetToken = async () => {
  const resetToken = crypto.randomBytes(32).toString("hex")
  return resetToken
}

module.exports = { hashPassword, comparePassword, passwordResetToken }
