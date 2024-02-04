const generateToken = require("../../Utils/GenerateToken.js")
const User = require("../../models/User/user.js")
const bcrypt = require("bcryptjs")
const asyncHandler= require("express-async-handler")
const sendmail = require("../../Utils/SendEmail.js")
const crypto = require("crypto")
//@desc Register a new user
//@route POST /api/v1/user/register
//@access public
exports.register = asyncHandler(async (req,res) =>{
        const {username,email,password} =req.body
        const UserFound = await User.findOne({username})
        if(UserFound){
            throw new Error('User Already Found')
        }
        
        const newUser = new User({
            username,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(password,salt)
        await newUser.save()

        res.status(201).json({
            Status:"Successful",
            message:"User Created Successfully",
            newUser
        })
    
})   

//@desc Logins in a new user
//@route POST /api/v1/user/login
//@access public
exports.login = asyncHandler(async (req,res) =>{
        const {username,password} =req.body
        const UserFound = await User.findOne({username})
        if(!UserFound){
            throw new Error('User Not Found')
        }
        
        const isMatched = await bcrypt.compare(password,UserFound?.password)
        if(!isMatched){
            throw new Error('Invalid Credentials')
        }
        
        UserFound.lastLogin = Date.now()
        await UserFound.save()

        res.status(201).json({
            Status:"Successful",
            message:"Login Successful",
            _id:UserFound?._id,
            name:UserFound?.name,
            email:UserFound?.email,
            password:UserFound?.password,
            chats:UserFound?.chats,
            favouriteChats:UserFound?.favouriteChats,
            blockedChats:UserFound?.blockedChats,
            token:generateToken(UserFound)
        })

})


//@desc Get User Details
//@route POST /api/v1/user/login
//@access public
exports.GetProfile = asyncHandler(async (req,res) =>{
        const UserFound = await User.findById(req.userAuth._id)

        res.json({
            Status:"Successful",
            message:"Profile Successfully fetched",
            UserFound
        })

})

//@desc Get User By Id
//@route POST /api/v1/chat-user/:userId
//@access public
exports.GetUserProfile = asyncHandler(async (req,res) =>{
        const UserFound = await User.findById(req.params.opponentId)

        res.json({
            Status:"Successful",
            message:"Profile Successfully fetched",
            UserFound
        })

})

exports.forgetPassword = asyncHandler(async(req,res)=>{
    const {username} = req.body;
    const FindEmail = await User.findOne({username})
    if(!FindEmail){
        throw new Error("User Not Found")
    }
    const resetToken = await FindEmail.generateResetToken()
    await FindEmail.save()
    sendmail(FindEmail.email,resetToken)
    res.status(201).json({
        status:"Successful",
        message:"Password Reset Link Email Sent Successfully"
    })
})

exports.resetPassword = asyncHandler(async(req,res)=>{
    const {resetToken} = req.params
    const {password} = req.body
    const Token = crypto.createHash('sha256').update(resetToken).digest('hex')
    const FindToken = await User.findOne({passwordResetToken:Token})
    if(!FindToken){
        throw new Error('Token Invalid/Expired')
    }
    const salt = await bcrypt.genSalt(10)
    FindToken.password=await bcrypt.hash(password,salt)
    FindToken.passwordResetExpries=undefined
    FindToken.passwordResetToken=undefined
    await FindToken.save()
    
    res.json({
        status:'Successful',
        message:"Password-Reset Successful"
    })
})
 
exports.changeUsername = asyncHandler(async(req,res)=>{
    const {currentUsername,newUsername}= req.body;
    console.log(currentUsername,newUsername)
    const FindUser = await User.findOne({username:currentUsername})
    console.log(FindUser)
    const newUservalidate = await User.findOne({newUsername})
    if(newUservalidate){
        throw new Error('Username Exists, Select Another')
    }

    FindUser.username = await newUsername
    await FindUser.save()
    res.status(200).json({
        status:'Successful',
        message:"Username Updated"
    })
    
})

exports.GetAllUsers = asyncHandler(async(req,res)=>{
    const Users = await User.find({})
    res.json({
        status:'successful',
        message:'All Users Fetched Successfully',
        Users
    })
})