const express = require("express")
const isLoggin = require("../../middlewares/isLoggin")
const multer = require("multer")
const { CreateChat, SendMessage,GetMessages,AddToFavourites,AddToBlockedChats,RemoveFromFavourites,RemoveFromBlockedChats, UpdateProfile } = require("../../Controllers/Chats/chat")
const { GetProfile, GetUserProfile } = require("../../Controllers/User/UserCtrl")
const chatsRouter = express.Router()
const storage = require("../../Utils/file")
const upload = multer({storage})


module.exports = (io) => {
    chatsRouter.use((req, res, next) => {
        req.io = io;
        next();
    });

    chatsRouter.get('/all',isLoggin,GetProfile)
    chatsRouter.get('/get-chats/:opponentId',isLoggin,GetUserProfile)
    chatsRouter.post('/profile-upload',isLoggin, upload.single('file'), (req,res)=>UpdateProfile(req,res));
    chatsRouter.get('/get-messages/:opponentId',isLoggin,GetMessages)
    chatsRouter.post('/:opponentId',isLoggin,CreateChat)
    chatsRouter.post('/message-sent/:senderId',isLoggin, upload.single('file'),(req, res) => SendMessage(req, res, io))
    chatsRouter.post('/favourites-add/:senderId',isLoggin,AddToFavourites)
    chatsRouter.post('/favourites-remove/:senderId',isLoggin,RemoveFromFavourites)
    chatsRouter.post('/block-user/:blockUserId',isLoggin,AddToBlockedChats)
    chatsRouter.post('/Unblock-user/:blockUserId',isLoggin,RemoveFromBlockedChats)
    return chatsRouter
}
