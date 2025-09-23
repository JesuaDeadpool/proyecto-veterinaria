const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authologin = require('../authomiddleware/autho_login');


/*Obtener lista de Productos*/
router.get('/productos',(req,res)=>{

    const sql= "Select * from Producto";

    pool.query(sql, (err,results) =>{
        if(err){
            res.status(500).json({status:500,message:'Error de Consulta',error:err.message});
        }
        else{
            res.status(200).json({status:200,message:'Conexion Exitosa',data:results});
        }
    });
});

/*Insertar Productos en tabla Producto*/
router.post('/productos',(req,res) =>{
    const producto = req.body;

    if(producto.precio<=0 || producto.stock<=0){
        return res.status(400).json({status:400,message:'Los campos ingresados no pueden ser menores a cero'});
    } 


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
router.put('/productos/:id',(req,res) =>{
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
router.delete('/productos/:id',authologin,(req,res) =>{
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


/* Creacion de una venta con detalles de productos, cantidades, y total*/

router.post('/ventas', (req, res) => {
    const ventas = req.body;
    const productos = ventas.productos;

    let total = 0;
    let procesados = 0;

    productos.forEach(producto => {

        const sql_precio_producto = "SELECT precio, stock FROM producto WHERE id_producto = ?";

        pool.query(sql_precio_producto, [producto.id_producto], (err, results) => {
            if (err || results.length === 0) {
                return res.status(400).json({ status: 400, message: 'Producto no encontrado' });
            }

            const precio = results[0].precio;
            const stock = results[0].stock;

            if (producto.cantidad > stock) {
                return res.status(400).json({ status: 400, message: 'Stock insuficiente' });
            }

            producto.subtotal = precio * producto.cantidad;
            total += producto.subtotal;
            procesados++;


            if (procesados === productos.length) {
                // Insertar Venta
                const sql_venta = 'INSERT INTO Venta(id_usuario,id_cliente,fecha,total) VALUES (?,?,?,?)';

                pool.query(sql_venta, [ventas.id_usuario, ventas.id_cliente, ventas.fecha, total], (err, resultVenta) => {
                    if (err) {
                        return res.status(400).json({ status: 400, message: 'Error al registrar una venta' });
                    }

                    const id_venta = resultVenta.insertId;
                    let detallesventas = 0;

                    productos.forEach(p => {
                        const sql_detalle_venta = 'INSERT INTO DetalleVenta(id_venta,id_producto,cantidad,subtotal) VALUES (?,?,?,?)';

                        pool.query(sql_detalle_venta, [id_venta, p.id_producto, p.cantidad, p.subtotal], (err) => {
                            if (err) {
                                return res.status(400).json({ status: 400, message: 'Error al registrar detalles' });
                            }

                            const sql_update_stock = 'UPDATE Producto SET stock = stock - ? WHERE id_producto = ? AND stock >= ?';
                            pool.query(sql_update_stock, [p.cantidad, p.id_producto, p.cantidad], (err) => {
                                if (err) {
                                    return res.status(400).json({ status: 400, message: 'Error al actualizar stock' });
                                }

                                detallesventas++;

                                if (detallesventas === productos.length) {
                                    return res.status(200).json({ status: 200, message: 'Venta realizada exitosamente' });
                                }
                            });
                        });
                    });
                });
            }
        });
    });
});
       
    
router.get('/ventas/:id_ventas',(req,res)=>{
        const id = req.params.id_ventas;

        const sql_registro_ventas=`Select v.id_venta,v.fecha, 
			u.nombre as NombreUsuario, u.id_usuario as CodigoUsuario
			from Venta v
			Join Usuario u ON v.id_usuario = u.id_usuario
            where v.id_venta= ?`

        pool.query(sql_registro_ventas,[id],(err,results) =>{

                if(err){
                    return res.status(400).json({status:400,message:'Error al obtener registro de ventas..'});
                }
                if (results.length === 0) {
                return res.status(404).json({ status: 404, message: 'Venta no encontrada' });
                }

                return res.status(200).json({status:200,message:'Registro de venta exitoso',venta:results[0]});
        });     
});
    


                
module.exports = router;