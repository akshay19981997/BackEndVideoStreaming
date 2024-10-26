import mongoose from 'mongoose';
import 'dotenv/config'; 
import { dbName } from '../constants.js';


const connectToDb = async () => {
   await mongoose.connect(`${process.env.mongoDbUrl_local}/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then (()=>{
        console.log("Connected")
      }).catch((err)=>{
        console.log(err)
      })
}
var connectionResult=connectToDb();
console.log(connectionResult);
export default connectToDb