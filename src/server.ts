
import app from "./app"
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`The PORT esta runing en el port ${PORT}` )
})