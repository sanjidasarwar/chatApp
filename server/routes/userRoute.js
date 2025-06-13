import express from 'express'

const userRoute = express.Router()

userRoute.get("/", getAllUsers)
userRoute.post("/", adduser)
userRoute.delete("/:id", deleteUser)


export default userRoute
