import { Router } from "express";

const router = Router();

// Ruta POST /api/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Credenciales de ejemplo
  const DEMO_EMAIL = "demo@correo.com";
  const DEMO_PASSWORD = "123456";

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Faltan credenciales" });
  }

  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return res.json({ success: true, message: "Has iniciado sesión" });
  } else {
    return res.status(401).json({ success: false, message: "Credenciales inválidas" });
  }
});

export default router;
