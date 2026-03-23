import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCart
} from "../controllers/cartController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addtocart",authMiddleware, addToCart);
router.delete("/clearcart",authMiddleware, clearCart);
router.get("/getCart",authMiddleware, getCart);

router.put("/updatecart",authMiddleware, updateCart);
router.delete("/removefromcart/:id",authMiddleware, removeFromCart);



export default router;
