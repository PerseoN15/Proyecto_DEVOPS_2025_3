import { Router } from "express";

const router = Router();


const VALID_USER = {
  email: process.env.LOGIN_EMAIL || "admin@tec.com",
  password: process.env.LOGIN_PASSWORD || "itsj"
};

router.post("/login", (req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son obligatorios" });
  }

  // Validar credenciales
  if (email === VALID_USER.email && password === VALID_USER.password) {

    return res.status(200).json({
      message: "Login exitoso",
      user: { email },
      token: "token-falso-de-ejemplo"
    });
  }

  return res.status(401).json({ message: "Credenciales inválidas" });
});

export default router;
