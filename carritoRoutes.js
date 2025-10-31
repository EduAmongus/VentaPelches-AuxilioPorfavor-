import express from "express";
import { db } from "../db.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM carrito WHERE id_carrito = ?", [req.params.id]);
  res.json(rows[0]);
});

export default router;
