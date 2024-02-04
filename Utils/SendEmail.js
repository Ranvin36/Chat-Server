const nodemailer = require("nodemailer")


const sendEmail = async(to,resetToken) =>{
    try{

        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:"ranvin.789@gmail.com",
                pass:process.env.Email_pass
            }
        })
        const message={
            to,
            subject:'Password Reset Link - ChatApp',
            html:`<p>Please Click on the following link, or paste this into your browser to complete the process</p>
            <p>http://localhost:3000/reset-password/${resetToken}</p>`
        }
    
        const info = await transporter.sendMail(message)
        console.log("message-sent",info)
    }
    catch(error){
        console.log(error)
    }
}

module.exports = sendEmail