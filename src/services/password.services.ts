import bcrypt from "bcrypt"

//?Utilizamos la biblioteca bcrypt para poder hascer el hasheo de las passwords
//?Esta constante nos dice cuantos saltos dara para hacer el hash 

const SALT_ROUNDS :number=10

//?Aqui devolvemos una promesa con la password ya hasheada
export const hashPassword=async(password:string):Promise<string>=>{
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePasswords= async(password:string, hash:string):Promise<boolean>=>{
    return await bcrypt.compare(password, hash)
}