import express, { Request, Response } from "express";
import cors from 'cors'
import { AppRouter } from "./app/routes";

const app = express();

app.use(express.json());
app.use(cors())

app.use('/api/v1',AppRouter)

app.get('/',(req:Request, res:Response)=>{
    res.status(200).json({
        message:'welcome to out server nigga'
    })
})


export default app;