import userRouter from './routes/user.Routes.js';
import  express  from 'express';
// var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
const app = express();


// import cors from "cors"
// import cookieParser from "cookie-parser"


// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/v1/users',userRouter)

export default app;