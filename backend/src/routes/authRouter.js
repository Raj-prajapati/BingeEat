import express from "express"
import {signUp,login,logout,refreshAccessToken,removeAddress,saveAddress} from "../controllers/authContoller.js"
import { authMiddleware } from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/signup",signUp)
router.post("/login",login)
router.post("/logout",authMiddleware,logout)
router.post("/refresh-token",authMiddleware,refreshAccessToken)
router.patch("/saveaddress",authMiddleware,saveAddress)
router.delete("/removeaddress",authMiddleware,removeAddress)


export default router;