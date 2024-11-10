import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.services";
import prisma from '../models/user';
import { generateToken } from "../services/auth.services";

export const register=async (req:Request, res: Response):Promise<void>=>{
    const {email, password}=req.body
    try{
            //Esta linea maneja un hasheador de password para hacerla mas segura, viene del archivo 
            //passwor.services
            const hashedPassword=await hashPassword(password)     
            console.log(hashedPassword)
            //Creamos el usuaio con la password hasheada
            const user = await prisma.create(
                {
                    data:{
                        email,
                        password:hashedPassword
                    }
                }
            )


            //?Aqui le generamos el token para que no necesite loguearse en un tiempo determinado 


            const token=generateToken(user)
            res.status(201).json({token})
        }catch(error:any){     
            //!Aqui mejoraremos el manejo de errores con prisma
            //Mejoramos los errore para que trate de evitar que se salten validaciones como un 
            //Correo que ya fue registrado
            if(!email){
                res.status(400).json({message:"El email es obligatorio"})
            }
            if(!password){
                res.status(400).json({message:"El password es obligatorio"})
            }
            if(error?.code==="P2002"&& error?.meta?.target.includes('email')){
                res.status(400).json({message:"El email ya esta registrado"})
            }
            console.log(error)
            res.status(500).json({error:"Hubo un error en el registro"})
    
    }

}

//Esta funcion nos permite loguearnos dentro de nuestra api
export const login=async(req:Request, res:Response):Promise<void>=>{
        const {email, password}=req.body
        try{
            //Con este if validamos que se envie un correo al querer hacer un login
            if(!email){
                res.status(400).json({message:"El email es necesario"})
                return
            }
            //Y con este verificamos que haya un passsword
            if(!password){
                res.status(400).json({
                    message:"El password es necesario"
                })
            }

            //Aqui hacemos un usuario con lo que se trae de la base de datos
            const user =await prisma.findUnique({where:{email}})
            //Verificamos que exista
            if(!user){
                res.status(404).json({message:"Usuario no encontrado"})
                return
            }
            //Y buscamos la password hasheada
            const passwordMatch= await comparePasswords(password, user.password)
            if(!passwordMatch){
                res.status(401).json({
                    error:"Usuario y contrasena no coinciden"
                }) 
            }
            const token = generateToken(user)
            res.status(200).json({token})
        }catch(error){

        }

}