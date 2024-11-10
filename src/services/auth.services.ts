import { User } from "../models/user.interface"
import jwt from "jsonwebtoken"


const JWT_SECRET=process.env.JWT_SECRET||"Defaul secret"
//Este json web token ayuda a generar un token para que la perosna no tenga que estar logueandose a cada rato
//Utilizando la palabra secreta que se encuentra en nuestras variables
export const generateToken=(user:User):string=>{
    return jwt.sign({
        id:user.id,
        email:user.email,
    }, JWT_SECRET, {expiresIn:"1h"})
}