const {Schema,mongoose}  = require("mongoose");

const MessagesSchema = new mongoose.Schema({
    sender:{
        type:Schema.Types.ObjectId,
        required:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        required:true
    },
    text:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:false,
        default:""
    },
    date:{
        type:String,
        default:""
    }
})

const Message = mongoose.model("Message",MessagesSchema)
module.exports = Message