import db from '../db.js';

export const completarCompra = async (req, res) => {
  const connection = await db.getConnection(); // obtener conexión individual
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No hay items en la solicitud.' });
    }

    await connection.beginTransaction();

    // Validar stock
    for (const it of items) {
      const [rows] = await connection.execute('SELECT stock FROM productos WHERE id = ? FOR UPDATE', [it.id_producto]);
      if (rows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: `Producto ${it.id_producto} no encontrado.` });
      }
      const stock = rows[0].stock;
      if (stock < it.cantidad) {
        await connection.rollback();
        return res.status(400).json({ message: `Stock insuficiente para producto ${it.id_producto}. Disponible: ${stock}` });
      }
    }

    // Actualizar stock
    for (const it of items) {
      await connection.execute('UPDATE productos SET stock = stock - ? WHERE id = ?', [it.cantidad, it.id_producto]);
    }

    await connection.commit();
    return res.json({ message: 'Compra completada y stock actualizado correctamente.' });
  } catch (error) {
    console.error('Error en completarCompra:', error);
    if (connection) await connection.rollback();
    return res.status(500).json({ message: 'Error interno al completar la compra.' });
  } finally {
    if (connection) connection.release();
  }
};
