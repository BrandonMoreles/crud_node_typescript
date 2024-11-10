import dotenv from "dotenv"
import express from "express"
import authRoutes from "./routes/authRoute"
import userRoutes from "./routes/userRoutes"
dotenv.config()
const app =express()
app.use(express.json())
//Routes
app.use("/auth", authRoutes)
//Autenticacion

//User
app.use("/users", userRoutes)
console.log("Esto esta corriendo bien chido")
export default app