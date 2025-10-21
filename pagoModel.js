import { db } from "../db.js";

export const Pago = {
  async crear({ id_carrito, monto, moneda }) {
    const [res] = await db.query(
      "INSERT INTO pagos (id_carrito, metodo, estado, monto, moneda) VALUES (?, 'paypal', 'CREATED', ?, ?)",
      [id_carrito, monto, moneda]
    );
    return res.insertId;
  },

  async actualizar(id_carrito, data) {
    await db.query(
      `UPDATE pagos
       SET estado=?, paypal_order_id=?, paypal_capture_id=?, detalles=?, fecha_pago=NOW()
       WHERE id_carrito=?`,
      [
        data.estado,
        data.paypal_order_id,
        data.paypal_capture_id,
        JSON.stringify(data.detalles),
        id_carrito,
      ]
    );
  },

  async getByCarrito(id_carrito) {
    const [rows] = await db.query("SELECT * FROM pagos WHERE id_carrito = ?", [id_carrito]);
    return rows[0];
  },
};
