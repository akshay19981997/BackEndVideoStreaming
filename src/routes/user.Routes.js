import { Router } from "express";
// import {userRegister} from "./controller/user.Register.js"
import userRegister, { loggInUser } from "../controller/user.Register.js";
import { upload } from "../middleware/multer.js";
import { jwtTokensAuth } from "../middleware/auth.middlleware.js";
import { logOutTheUser ,refreshTheAccessToken} from "../controller/user.Register.js";
const router = Router();

router.route('/Register').post(upload.fields([
{
 name:"avatar",
 maxCount:1},
{
name:"coverImage",
maxCount:1
}]),userRegister);
router.route('/login').post(loggInUser)
router.route('/logout').post(jwtTokensAuth,logOutTheUser)
router.route('/refreshToken').post(refreshTheAccessToken)

export default router;
