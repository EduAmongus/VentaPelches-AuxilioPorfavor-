import express from "express";
import { db } from "../db.js";
const router = express.Router();

router.get("/:id_carrito", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM pagos WHERE id_carrito = ?", [req.params.id_carrito]);
  res.json(rows[0]);
});

export default router;
