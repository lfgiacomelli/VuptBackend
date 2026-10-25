import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authAttendantMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token não fornecido ou mal formatado."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_EMPLOYEE);

    req.manager = {
      id: decoded.id,
      email: decoded.email,
    };

    next(); 
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado."
    });
  }
};