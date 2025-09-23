require('dotenv').config();
const express = require('express');
const mysql = require ('mysql2');
const app = express();
const PORT = 3000;
const pool = require('./config/database');

app.use(express.json());



/*Obtener lista de Productos*/
app.get('/productos',(req,res)=>{
    const sql= "Select * from Producto";

    pool.query(sql, (err,results) =>{
        if(err){
            res.status(500).json({status:500,message:'Error de Consulta',err:message});
        }
        else{
            res.status(200).json({status:200,message:'Conexion Exitosa',data:results});
        }
    });
});

/*Insertar Productos en tabla Producto*/
app.post('/productos',(req,res) =>{
    const producto = req.body;
    const sql="Insert into producto (nombre,precio,stock) values (?,?,?)";

    pool.query(sql,[producto.nombre,producto.precio,producto.stock],(err,results)=>{
        if(err){
        res.status(500).json({status:500,message:'Error en la Solicitud'});
        }
        else{
            res.status(201).json({status:201,message:'Registro Producto Exitoso',data:producto});
        }
    });
});

/*Actualizar Productos en tabla Producto*/
app.put('/productos/:id',(req,res) =>{
    const id = parseInt(req.params.id);
    const producto = req.body;

    const sql = 'Update producto set nombre = ? , precio = ? , stock = ? where id_producto= ?';

    pool.query(sql,[producto.nombre, producto.precio, producto.stock,id],(err,results) =>{
        if(err){
            return res.status(500).json({status:500, message:'Error al Actualizar'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404, message:'Registro no encontrado'});
        }
            return res.status(200).json({status:200, message:'Registro Actualizado'});
    });
});

/*Eliminar Productos en tabla Producto*/
app.delete('/productos/:id',(req,res) =>{
        const id = parseInt(req.params.id);

        const sql = 'delete from producto where id_producto = ?';

        pool.query(sql,[id],(err,results)=>{
        if(err){
            return res.status(500).json({status:500, message:'Error al Eliminar'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404, message:'Registro no encontrado'});
        }
            return res.status(200).json({status:200, message:'Registro Eliminado Exitosamente'});
        });
});


app.get('',(req,res) =>{
    res.send('Configuracion exitosa');
});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

