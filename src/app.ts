import express, { Request, Response } from "express";
import cors from 'cors'
import { AppRouter } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.set("trust proxy",1)

app.use('/api/v1',AppRouter)

app.get('/',(req:Request, res:Response)=>{
    res.status(200).json({
        message:'Welcome to Digital Baking System'
    })
})

app.use(globalErrorHandler);
app.use(notFound)


export default app;