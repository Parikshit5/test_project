import express from "express";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from "cors";
import cookieParser from "cookie-parser";
import { DOCUMENT_LIMIT} from "./constants.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:DOCUMENT_LIMIT}))

app.use(express.urlencoded({extended:true,limit:DOCUMENT_LIMIT}))

app.use(express.static("public"))

app.use(cookieParser())

app.use(helmet());

app.use(xss());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
    standardHeaders: true, 
    legacyHeaders: false, 
  });
  

app.use(limiter);

//UserRoutes import
import userRouter from "./routes/user/user.routes.js"

//UserRoute Declaration
app.use("/api/v1/users",userRouter)

//Admin Routes import
import adminRouter from "./routes/admin/admin.routes.js"
import adminUserRouter from "./routes/admin/admin.user.routes.js"

app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/admin/user",adminUserRouter)

export {app};