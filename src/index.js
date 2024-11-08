
import express from 'express';
import app from './app.js';

// const mongoDbUrl = 'mongodb+srv://akshayshukla19971998:hithere@cluster0.av0lt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
import connectDB from "./db/index.js";
// import {app} from './app.js'




connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000} `);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})