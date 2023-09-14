const express = require("express")
const connectDB = require("./config/db.js")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const blogRoutes = require("./routes/blogRoutes")

//configure env
dotenv.config()

//rest object
const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

// routes
app.use("/api/v1/user", authRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/blog", blogRoutes)

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
