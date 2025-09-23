require('dotenv').config();
const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const authologin = require('../authomiddleware/autho_login');



route.post('/login', async (req, res)=>{
    const usuario = req.body;

    if(!usuario.nombre || !usuario.correo_electronico || !usuario.contraseña){
        return res.status(400).json({status:400, message:'Usuario Contraseña y correo electronico son requeridos..'});
    }

    /* Buscar mejor por correo mas especifico, en mysql tiene valor unique, no puede repetirse*/
    const sql = 'select * from Usuario where correo_electronico=?';

    pool.query(sql, [usuario.correo_electronico], async (err, results)=>{

        if(err){
            return res.status(500).json({status:500, message:'Ocurrio un error de conexión con el servidor'});
        }

        if(results.length === 0){
            return res.status(401).json({status:401, message:'Credenciales invalidas'});
        }

        let user= results[0];
        const matching = await bcrypt.compare(usuario.contraseña, user.contraseña);

        if(!matching){
            return res.status(401).json({status:401, message:'Credenciales invalidas'});
        }

        const token = jwt.sign(
            {usuario: usuario.nombre},
            process.env.SecretKey,
            {expiresIn:process.env.expiration}
        ); 

        res.status(200).json({status:200,message:'Success',token:token});
    });
});


route.post('/usuarios',async (req,res)=>{
        const usuario = req.body;
       
        if (!usuario.nombre || !usuario.correo_electronico || !usuario.contraseña){
                return res.status(400).json({status:400,message:'Todos los campos son obligatorios'});
        };

        const sql ='INSERT INTO Usuario (nombre,correo_electronico,contraseña) values (?,?,?)';
        const saltRound = 10;
        const contraseñaEncriptada = await bcrypt.hash(usuario.contraseña,saltRound);

        pool.query(sql,[usuario.nombre,usuario.correo_electronico,contraseñaEncriptada],(err,results)=>{

            if(err){
                return res.status(500).json({status:500,message:'Usuario no Creado'});
            }

            res.status(201).json({status:201,message:'Usuario creado exitosamente'});
        });

});


module.exports = route;