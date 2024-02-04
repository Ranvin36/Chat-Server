const mongoose = require("mongoose")
const crypto = require("crypto")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:function(){
            return ! this.provider
        }
    },
    provider:{
        type:String,
        required:function(){
            return ! this.password
        }
    },
    lastLogin:{
        type:Date,
        default:Date.now()
    },
    profilePicture:{
        type:String,
        default:""
    },
    passwordResetToken:{
        type:String
    },
    passwordResetExpries:{
        type:Date
    },
    accountVerificationToken:{
        type:String
    },
    accountVerificationExpires:{
        type:Date
    },
    chats:[{type:mongoose.Schema.Types.ObjectId}],
    favouriteChats:[{type:mongoose.Schema.Types.ObjectId}],
    blockedChats:[{type:mongoose.Schema.Types.ObjectId}],
},{
    timestamps:true
})

UserSchema.methods.generateResetToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires= Date.now() + 10*60*1000
    return resetToken
}

const User = mongoose.model("User",UserSchema)
module.exports = User



