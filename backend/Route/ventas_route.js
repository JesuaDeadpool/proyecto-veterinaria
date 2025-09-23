const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authologin = require('../authomiddleware/autho_login');


router.get('/ventas', authologin, async (req, res) => {
  const { cliente, telefono, detalle } = req.body;
  const usuario_id = req.user.id;


  const total = detalle.reduce((acc, item) => acc + item.cantidad * item.precio, 0);


  const [result] = await db.query(
    'INSERT INTO ventas (cliente, telefono, total, usuario_id) VALUES (?, ?, ?, ?)',
    [cliente, telefono, total, usuario_id]
  );
  const venta_id = result.insertId;


  for (const item of detalle) {
    await db.query(
      'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)',
      [venta_id, item.id, item.cantidad, item.cantidad * item.precio]
    );
  }

  res.json({ id: venta_id, total });
});


router.get('/api/ventas/:id', authologin, async (req, res) => {
  const venta_id = req.params.id;

  const [ventaRows] = await db.query('SELECT * FROM ventas WHERE id = ?', [venta_id]);
  if (!ventaRows.length) return res.status(404).json({ message: 'Venta no encontrada' });

  const venta = ventaRows[0];

  const [detalleRows] = await db.query(`
    SELECT dv.cantidad, dv.subtotal, p.nombre, p.precio
    FROM detalle_ventas dv
    JOIN productos p ON dv.producto_id = p.id
    WHERE dv.venta_id = ?
  `, [venta_id]);

  res.json({ ...venta, detalle: detalleRows });
});


module.exports = router; 
