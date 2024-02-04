const  mongoose = require('mongoose');

const mongoDB = async () =>{
    try{
        mongoose.connect(process.env.DB_KEY,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database Is Connected.....")
    }
    catch(error){
        console.log(error.message)
    }
}

module.exports = mongoDB