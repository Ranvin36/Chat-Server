const  mongoose = require('mongoose');

const mongoDB = async () =>{
    console.log(process.env.DB_KEY)
    try{
        mongoose.connect(process.env.DB_KEY || "mongodb+srv://ranvin789:9XM1B5SgmSmKLrmo@chat36.caendrp.mongodb.net/?retryWrites=true&w=majority",{
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