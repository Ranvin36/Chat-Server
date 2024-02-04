const http = require("http")
const express = require("express")
const userRouter = require("./Routes/User/userRoutes")
const setupChatsRoutes = require("./Routes/chats/chatsRouter")
const googleRouter = require("./Routes/User/google")
const { globalErrhandler } = require("./middlewares/globalErrorHandler")
const cors = require('cors')
const SocketIo= require("socket.io")
const Message = require("./models/Chats/chat")
const app = express()
const passport = require('passport');
const session = require('express-session');
const User = require("./models/User/user")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const server = http.createServer(app)
const dotenv = require("dotenv")
dotenv.config()
const io = SocketIo(server,{
    cors:{
        origin:"https://fleexy-chat-api.onrender.com",
        methods:["GET","POST"]
    }
})

require("./Config/database") ()

const corsOptions = {
   origin: '*',
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
   optionsSuccessStatus: 204,
}

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async(id, done) => {
  try{
    const user = await User.findById(id)
        done(null, user);

  }
  catch(error){
    done(error,null)
  }
});


app.use(session({
  secret: '#23131', 
  resave: false,
  saveUninitialized: false
}))
app.use(cors(corsOptions))
app.use(express.json())
app.use(passport.session());

passport.use(new GoogleStrategy({
  callbackURL: "http://localhost:3001/auth/google/callback",
  clientID:"1068895465736-568t9mqvjsa79fo9u2rpg29lv5802b7d.apps.googleusercontent.com",
  clientSecret:"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",
  passReqToCallback   : true
},
  function(request,accessToken,refreshToken,profile,done){
    console.log("HEY")
    console.log(profile)
    User.findOne({username:profile.displayName})
      .then(user=>{
        if(user){
          return done(null,user)
        }
        else{
          const newUser = new User({
            username: profile.displayName,
            email:profile.email,
            provider:profile.provider
          })  
          newUser.save()
            .then(savedUser =>{
              return done(null,savedUser)
            })
            .catch(err =>{
              return done(err,null)
            })
        }
      })
  }
))

// app.get('/auth/google',
//   passport.authenticate('google',{scope:['email','profile']})
// )
// app.get('/auth/google/callback',passport.authenticate('google',{
//   successRedirect:'/auth/google/success',
//   failureRedirect:'/auth/google/failure',
// }))

app.use('/api/v1/user',userRouter)
app.use('/api/v1/chats',setupChatsRoutes(io))
app.use('/auth',googleRouter)
app.use(globalErrhandler)

io.on("connection", (socket) => {  
    // Handle events when a message is sent
    socket.on("joinRoom", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });
  
    socket.on("fetchMessages", async({userId, opponentId})=>{
       const messages = await Message.find({$or:[
        {sender:userId,receiver:opponentId},
        {sender:opponentId,receiver:userId}
       ],}).exec()

       io.emit("messages", messages);

    })
    socket.on("sendMessage", async({message,userId,Receiver})=>{
      console.log("Web Socket")

      const text = message
      // const file= data.file? data.file.path : " "
      const sender=userId
      const receiver = Receiver

      const newMessage = new Message({
        sender,
        receiver,
        text
        // image : file
      })

      await newMessage.save().then(()=>{
        io.to(receiver).emit("newMessage")

      })


    })

    // socket.on("test1",async(number)=>{
    //   number++
    //   console.log(number)
    //   socket.emit("TestUpdate",number)
    //   socket.broadcast.emit("TestUpdate",number)
    // })
  
    // Disconnect event
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

const PORT = process.env.PORT || 3001
server.listen(PORT, console.log(`Server Running On Port ${PORT}`))