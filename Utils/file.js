const cloudinary = require("cloudinary").v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const dotenv = require("dotenv")
dotenv.config()

cloudinary.config({ 
    cloud_name: 'ds5sp8rno', 
    api_key: process.env.cloudinary_api_key, 
    api_secret: process.env.cloudinary_api_secret
  });

const Storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats:['jpg','png','jpeg'],
    params:{
        folder:'chat-data',
        transformation:[{width:500,height:500,crop:"limit"}],
    },
});

module.exports=Storage