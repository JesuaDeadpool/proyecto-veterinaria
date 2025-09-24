const jwt =require ('jsonwebtoken');

require('dotenv').config;

const authologin = (req,res,next)=>{
    const authoHeader = req.headers['authorization'];

    if(!authoHeader){
        return res.status(401).json({status:401,message:'Error al obtener token'});
    }

    const token =authoHeader.split(' ')[1]

    jwt.verify(token, process.env.SecretKey, (err,user) =>{
        if(err){
            return res.status(401).json({status:401,message:'Token invalido'});
        }
        next();
    });
}

module.exports= authologin;