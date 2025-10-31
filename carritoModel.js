import { db } from "../db.js";
export const Carrito = {
  async getById(id_carrito) {
    const [rows] = await db.query("SELECT * FROM carrito WHERE id_carrito = ?", [id_carrito]);
    return rows[0];
  },

  async updateEstadoPago(id_carrito, estado) {
    await db.query("UPDATE carrito SET estado_pago = ?, estado = ? WHERE id_carrito = ?", [estado, estado, id_carrito]);
  },

  async setPago(id_carrito, id_pago) {
    await db.query("UPDATE carrito SET id_pago = ?, fecha_pago = NOW(), estado_pago = 'pagado', estado = 'completado' WHERE id_carrito = ?", [id_pago, id_carrito]);
  },
};
