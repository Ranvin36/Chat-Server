const express = require("express")
const passport = require("passport")
const User = require("../../models/User/user")
const generateToken = require("../../Utils/GenerateToken")
const googleRouter= express.Router()

googleRouter.get('/google/login/success',async(req,res)=>{
    if(req.user){
        const UserFound = await User.findOne({username:req.user.username})
        
        const userData ={
             status:'Success',
             message:'User Login Success',
             user:req.user._id,
             token:generateToken(UserFound)
         }
         console.log(userData.token)

        // const queryParams = new URLSearchParams(userData).toString()
        res.redirect(`http://localhost:3000/login?userId=${userData.token}`)
        // res.status(200).json({
        //     status:'Success',
        //     message:'User Logged IN Successfully',
        //     user:req.user
        // })
    }
    else{
        res.status("ERRORRRRRRRR!")
    }
})
googleRouter.get('/login/failed', (req,res)=>{
    res.status({
        status:'failed',
        message:'Login Failed'
    })
})
googleRouter.get('/google/callback',passport.authenticate("google",{
    
    successRedirect:'login/success',
    failureRedirect:'login/failed'
    })
)
googleRouter.get('/google',passport.authenticate("google",{scope:["profile","email"]}))

module.exports = googleRouter