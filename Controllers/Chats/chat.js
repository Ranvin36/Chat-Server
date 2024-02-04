//@desc Create New Chat
//@route POST /api/v1/chats/:opponentId
//@access private

const asyncHandler = require("express-async-handler");
const User = require("../../models/User/user");
const Message = require("../../models/Chats/chat")

exports.CreateChat = asyncHandler(async(req,res)=>{
    const ChatOpponentId = req.params.opponentId
    const ChatFindUser = await User.findById(ChatOpponentId)
    if(!ChatFindUser){
        throw new Error('Opponent User Not Found')
    }
    const AddToChats = await User.findByIdAndUpdate(req.userAuth._id,{
        $addToSet:{chats:ChatOpponentId}
    })
    const AddToChatsOpponent = await User.findByIdAndUpdate(ChatOpponentId,{
        $addToSet:{chats:req.userAuth._id}
    })
    res.json({
        status:"Successful",
        message:"Chat Created Successfully"
    })
})

exports.SendMessage = asyncHandler(async(req, res) => {
    try {
         console.log("Inside SendMessage route");
         const currentDate = new Date()
         const options={
            hour:'2-digit',
            minute:'2-digit'
         }
         const date = currentDate.toLocaleString('en-US',options)
         let image=""
         const { text } = req?.body
         const sender = req.userAuth._id;
         const receiver = await User.findById(req.params.senderId);

        if (!receiver) {
             throw new Error('User Not Found');
         }

         if(req?.file){
            image = req?.file?.path
         }

        const newMessage = new Message({
            sender,
            receiver,
            text,
            image,
            date
        });

        await newMessage.save().then(()=>{
            console.log("Data Saved")
            req.io.to(req.params.senderId).emit("newMessage", { sender, text });
        })

        res.status(201).json({
            status: "Successful",
            message: "Message Sent Successfully",
            newMessage
        });
    } catch (error) {
        console.error("Error in SendMessage route:", error);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error"
        });
    }
});


exports.GetMessages = asyncHandler(async(req, res) => {
    const id = req.userAuth._id;
    const OpponentId = req.params.opponentId;
    const Messages = await Message.find({$or:[
        {sender: id, receiver: OpponentId},
        {sender:OpponentId ,receiver:id}
    ]
})

    if (!Messages.length) {
        throw new Error('No Messages Found');
    }

    res.json({
        status: "Successful",
        Message: "Messages Fetched Successfully",
        Messages
    });
});

exports.AddToFavourites = asyncHandler(async(req,res)=>{
     const sender= req.params.senderId
     const ChatSender= await User.findById(sender)
     if(!ChatSender){
        throw new Error('Opponent User Not Found')
     }
     const FavouritesAddUser = await User.findByIdAndUpdate(req.userAuth._id,{
        $addToSet:{favouriteChats:sender}
     })

     res.json({
        status:"Successful",
        message:"User Added To Favourites"
     })
})

exports.RemoveFromFavourites = asyncHandler(async(req,res)=>{
     const sender= req.params.senderId
     const ChatSender= await User.findById(sender)
     if(!ChatSender){
        throw new Error('Opponent User Not Found')
     }
     await User.findByIdAndUpdate(req.userAuth._id,{
        $pull:{favouriteChats:sender}
     })

     res.json({
        status:"Successful",
        message:"User Removed From Favourites"
     })
})

exports.AddToBlockedChats = asyncHandler(async(req,res)=>{
    const UserId = await User.findById(req.userAuth._id)
    if(!UserId){
        throw new Error('User Not Found')
    } 
    const BlockUserId = await User.findById(req.params.blockUserId)
    if(!UserId){
        throw new Error('Block User Not Found')
    } 
    const BlockUserExists = UserId.blockedChats.filter((item)=>item ==req.params.blockUserId)
    if(BlockUserExists.length>0){
        throw new Error('User Already Blocked')
    }
    const UserChatFind = UserId.chats.includes(req.params.blockUserId)
    if(!UserChatFind){
        throw new Error('Chat Not Identified')
    }
     await User.findByIdAndUpdate(req.userAuth._id,{
        $pull:{chats:req.params.blockUserId}
    })
    await User.findByIdAndUpdate(req.userAuth._id,{
        $addToSet:{blockedChats:req.params.blockUserId}
    })
    res.json({
        status:"Successful",
        message:"User Blocked Successfully"
    })
})

exports.RemoveFromBlockedChats = asyncHandler(async(req,res)=>{
    const UserId = await User.findById(req.userAuth._id)
    if(!UserId){
        throw new Error('User Not Found')
    } 
    const BlockUserId = await User.findById(req.params.blockUserId)
    if(!UserId){
        throw new Error('Block User Not Found')
    } 
    const BlockUserExists = UserId.blockedChats.filter((item)=>item ==req.params.blockUserId)
    if(!BlockUserExists){
        throw new Error('User Not Blocked')
    }
    const UserChatFind = UserId.blockedChats.includes(req.params.blockUserId)
    if(!UserChatFind){
        throw new Error('Chat Not Identified')
    }
     await User.findByIdAndUpdate(req.userAuth._id,{
        $pull:{blockedChats:req.params.blockUserId}
    })
    await User.findByIdAndUpdate(req.userAuth._id,{
        $addToSet:{chats:req.params.blockUserId}
    })
    res.json({
        status:"Successful",
        message:"User UnBlocked Successfully"
    })
})

exports.UpdateProfile = asyncHandler(async(req,res)=>{
    console.log("tt")
    const userId = req.userAuth._id
    console.log(userId,"ID")
    const FindUser = await User.findById(userId)
    const image = req?.file?.path
    // if(!FindUser){
    //     throw new Error('User Not Found')
    // }
    FindUser.profilePicture=image
    await FindUser.save()

    res.json({
        status:"Successful",
        message:"File Accepted",
        FindUser
    })
})