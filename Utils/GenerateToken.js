const jwt = require('jsonwebtoken')

const generateToken = (user)=>{
    const payload={
        user:{
            id:user.id
        }
    }   

    const token= jwt.sign(payload,"anykey",{
        expiresIn:36000
    })

    return token
}

module.exports = generateToken