const jwt = require("jsonwebtoken")
const User = require("../models/User/user")

const isLoggin = (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    
    jwt.verify(token,'anykey',async(err,decoded)=>{
        const userId = decoded?.user?.id

        const UserFind = await User.findById(userId).select('name email _id')

        req.userAuth=UserFind

        if(err){
            const err = new Error("Token Invalid/Expired")

            next(err)
        }
        else{
            next()
        }
    })
}

module.exports = isLoggin