import express from "express";
import { db } from "../db.js";
import { completarCompra } from "../Controllers/stockController.js";
const router = express.Router();

router.get("/:id_carrito", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM pagos WHERE id_carrito = ?", [req.params.id_carrito]);
  res.json(rows[0]);
});

router.post('/completar', completarCompra);

export default router;
