import { Request, Response } from "express";
import { hashPassword } from '../services/password.services';
import prisma from '../models/user';
import { error } from "console";

export  const createUser= async(req:Request, res:Response):Promise<void>=>{
    try{
        //Desestrcturamos el body que se nos envia desde el front
        const {email, password}=req.body
        //Creamos condicionales para verificar que los datos se envien completos
        if(!email){
            res.status(400).json({message:"El email es obligarotio"})
            return
        }
        if(!password){
            res.status(400).json({message:"El password es obligatorio"})
        }


        const hashedPassword=await hashPassword(password)
        const user= await prisma.create({
            data:{
                email,
                password:hashedPassword
            }
        })
        res.status(201).json(user)
    }
    catch(error:any){
        if(error?.code==="P2002"&&error?.meta?.target?.includes("email")){
            res.status(400).json({message:"El email ya esta registrado"})
        }
        console.log(error)
        res.status(500).json({message:"Hubo un error en el registro"})
    }
}

export const getAllUsers=async(req:Request, res:Response):Promise<void> =>{
    try{
        const users=await prisma.findMany()
        res.status(200).json(users)
    }catch(error:any){
        console.log(error)
        res.status(500).json({message:"Hubo un error en la obtencion de los datos"})
    }
}

export const getUserById= async(req:Request, res:Response):Promise<void>=>{
    //Obtenemos el id de los parametros
    const userId=parseInt(req.params.id)
    try{
        //Y buscamos por ese Id a un usuario en nuestra base de datos sql
        const user=await prisma.findUnique({
            where:{
                id:userId
            }
        })
        //Hacemos un condicional por si el usuario no existe
    if(!user){
        res.status(404).json({message:"El usuario no existe"})
        return 
    }
    res.status(200).json(user)
    }catch(errror){
        console.log(error)
        res.status(500).json({error:"Hubo un error en la peticion, pruebe mas tarde"})
    }
}

export const updateUser =async(req:Request,res:Response):Promise<void>=>{
    const userId=parseInt(req.params.id)
    const{email,password}=req.body
    try{
        let dataToUpdate:any={...req.body}
        if(password){
            const hashedPassword=await hashPassword(password)
            dataToUpdate.password=hashedPassword
    }
    if(email){
        dataToUpdate.email=email
    }

    const user=await prisma.update({
        where:{
            id:userId
        },
        data:dataToUpdate
    })
    res.status(200).json(user)
    }catch(error:any){
        if(error?.code==="P2002"&&error?.meta?.target?.includes("email")){
            res.status(400).json({error:"El email ingresado ya existe"})
        }else if(error?.code==="P2025"){
            res.status(404).json({error:"El ususario no existe"})
        }else{
            console.log(error)
            res.status(500).json({error:`Hubo un error al momento de procesar la solicitud, 
                intente de nuevo mas tarde`})
        }
    }
}

export const deleteUser=async(req:Request, res:Response):Promise<void>=>{
    const userId=parseInt(req.params.id)
    try{
        await prisma.delete(
            {
                where:{
                    id:userId
                }
            }
        )
        res.status(200).json({
            message:`El usuario ${userId} ha sido eliminado`
        }).end()
    }catch(error:any){
        if(error?.code==="P2025"){
            res.status(404).json({error:"El ususario no existe"})
        }else{
            console.log(error)
            res.status(500).json({error:`Hubo un error al momento de procesar la solicitud, 
                intente de nuevo mas tarde`})
        }
    }
}