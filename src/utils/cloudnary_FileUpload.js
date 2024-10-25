import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
cloudinary.config({
upload_secret_key :process.env.upload_secret_key,
upload_name:process.env.upload_name,
upload_api:process.env.upload_api
})



const uploadOnCloudinary = async (localFileUploadPath) =>{

    

    try {
        if(!localFileUploadPath) return null;
        const response = await cloudinary.uploader.upload(localFileUploadPath, {resource_type : auto})
        console.log("uploaded file path");
        console.log(response);
        return response; 
    }
    catch(error) {
        fs.unlinkSync(localFileUploadPath);//this removes file from the uploaded path in local server as
        //upload operation got failed
        return null;
    }
}