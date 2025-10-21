import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paypalRoutes from "./Routes/paypalRoutes.js";
import carritoRoutes from "./Routes/carritoRoutes.js";
import pagoRoutes from "./Routes/pagoRoutes.js";
import catalogoRoutes from "./Routes/catalogoRoutes.js";

dotenv.config();


const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));
app.use(express.json());

app.use("/api/paypal", paypalRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/catalogo", catalogoRoutes);

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor jalando epicamente en puerto ${PORT}`);
});
