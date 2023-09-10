const express = require("express")
const app = express()
const connectDB = require("./config/db.js")
const dotenv = require("dotenv").config()
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  try {
    // database config
    connectDB()
    console.log(`server is listening on port ${PORT}`)
  } catch (error) {
    console.log(error)
  }
})
