import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando correctamente 🚀");
});

// Rutas de autenticación
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
});
