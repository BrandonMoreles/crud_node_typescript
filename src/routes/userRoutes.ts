import express, { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/userControllers";

const router = express.Router()


const JWT_SECRET=process.env.JWT_SECRET||"default-secret"
//Mioddeleware de JSON web token para ver si estamos autenticados
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "No autorizado" });
        return;  // Salimos de la función para evitar llamar a `next`
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Error en la autenticación:", err);
            res.status(403).json({ error: "No tienes acceso a este recurso" });
            return;  // Salimos de la función para evitar llamar a `next`
        }

        next();  // Solo se llama si la verificación es exitosa
    });
};

router.post("/", authenticateToken, createUser)
router.get('/', authenticateToken, getAllUsers)
router.get("/:id", authenticateToken, getUserById)
router.put("/:id", authenticateToken, updateUser)
router.delete("/:id", authenticateToken, deleteUser)

export default router
