import { Router } from "express";
// import {userRegister} from "./controller/user.Register.js"
import userRegister from "../controller/user.Register.js";
import { upload } from "../middleware/multer.js";
const router = Router();

router.route('/Register').post(upload.fields([
{
 name:"avatar",
 maxCount:1},
{
name:"coverImage",
maxCount:1
}]),userRegister);

export default router;
