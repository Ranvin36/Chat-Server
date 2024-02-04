const express = require("express")
const { register, login,forgetPassword,resetPassword,changeUsername,GetAllUsers } = require("../../Controllers/User/UserCtrl")
const isLoggin = require("../../middlewares/isLoggin")
const userRouter = express.Router()

userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.post('/reset-password',forgetPassword)
userRouter.post('/forgot-password/:resetToken',resetPassword)
userRouter.post('/change-username',changeUsername)
userRouter.get('/get-users',GetAllUsers)

module.exports = userRouter