const express = require("express")
const connectDB = require("./config/db.js")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/userRoutes")

//configure env
dotenv.config()

//rest object
const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())

// routes
app.use("/api/v1/user", authRoutes)

// port
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  try {
    // database config
    connectDB()
    console.log(`server is listening on port ${PORT}`)
  } catch (error) {
    console.log(error)
  }
})
