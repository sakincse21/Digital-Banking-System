import express, { Request, Response } from "express";
import cors from 'cors'
import { AppRouter } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
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
