import express, { Request, Response } from "express";
import cors from "cors";
import { AppRouter } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";

const app = express();

app.use(express.json());
// app.use(cors({
//   origin: envVars.FRONTEND_URL,
//   credentials: true,
// }));


app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST","PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use((req: Request, res: Response, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', envVars.FRONTEND_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    res.status(200).end();
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

app.use("/api/v1", AppRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Digital Baking System",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
