import { Router } from "express";
// import {userRegister} from "./controller/user.Register.js"
import userRegister from "../controller/user.Register.js";
const router = Router();

router.route('/Register').post(userRegister);

export default router;
