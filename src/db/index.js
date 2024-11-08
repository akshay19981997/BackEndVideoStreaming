import mongoose from 'mongoose';
import 'dotenv/config'; 
import { dbName } from '../constants.js';

console.log("MongoDB cluster url " + process.env.mongoDbUrl + 'and db name' + dbName )
const connectToDb = async () => {
   await mongoose.connect(`${process.env.mongoDbUrl}/${dbName}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then (()=>{
        console.log("Mongo DB Connected")
      }).catch((err)=>{
        console.log("Mongo Dd Error" + err)
        process.exit(1)
      })
}
var connectionResult=connectToDb();
console.log(connectionResult);
export default connectToDb