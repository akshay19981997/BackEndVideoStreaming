import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  thumbnail:{
    type:String
  },
  views:{
    type:Number
  },
  title:{
    type:Number
  },
  duration:{
    type:Number
  },
  description:{
    type:String
  }, 
  updatedAt:{
    type:String
  }, 
  isCreatedAt:{
    type:String
  }, 
  isPublished:{
    type:Boolean
  },  
})

export const Video = mongoose.model("Video",videoSchema);