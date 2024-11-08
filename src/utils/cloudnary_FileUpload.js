import {v2 as cloudinary} from 'cloudinary';
import { Console } from 'console';
import fs from "fs";
import dotenv from "dotenv"
dotenv.config();
// console.log("Values of config are" + process.env.upload_name + " " + process.env.upload_api + " " +  process.env.upload_secret_key)
cloudinary.config({
cloud_name:process.env.upload_name,
api_key:process.env.upload_api,
api_secret :process.env.upload_secret_key


})
console.log('Cloudinary Config:', {
    cloud_name: process.env.upload_name,
    api_key: process.env.upload_api,
    api_secret: process.env.upload_secret_key,
  });



const uploadOnCloudinary = async (localFileUploadPath) =>{

    console.log("Multer Url is"  +localFileUploadPath )

    try {
        console.log("Here it is 1");
        if(!localFileUploadPath) return null;
        console.log("Here it is 2");
        const response = await cloudinary.uploader.upload(localFileUploadPath, {resource_type : "auto"})
        console.log("uploaded file path");
        console.log(response);
        return response; 
    }
    catch(error) {
        fs.unlinkSync(localFileUploadPath);//this removes file from the uploaded path in local server as
        console.log("Operatio failed" + error)
        //upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}