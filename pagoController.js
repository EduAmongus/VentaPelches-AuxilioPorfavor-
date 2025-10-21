import { Pago } from "../models/pagoModel.js";

export const obtenerPagoPorCarrito = async (req, res) => {
  try {
    const { id_carrito } = req.params;
    const pago = await Pago.getByCarrito(id_carrito);

    if (!pago) {
      return res.status(404).json({ mensaje: "No se encontró un pago para este carrito." });
    }

    res.json(pago);
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    res.status(500).json({ error: "Error al obtener el pago" });
  }
};

export const obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.getAll();
    res.json(pagos);
  } catch (error) {
    console.error("Error al listar pagos:", error);
    res.status(500).json({ error: "Error al listar pagos" });
  }
};

export const eliminarPago = async (req, res) => {
  try {
    const { id_pago } = req.params;
    const eliminado = await Pago.delete(id_pago);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Pago no encontrado o no eliminado" });
    }

    res.json({ mensaje: "Pago eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    res.status(500).json({ error: "Error al eliminar el pago" });
  }
};
