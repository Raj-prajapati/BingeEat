import express from "express";
import {
cancelOrder,
getOrderById,
getOrderHistory,
getRestaurantOrders,
placeOrder,
updateOrderStatus,
} from "../controllers/orderController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/placeorder",authMiddleware, placeOrder);

router.get("/getorderbyid/:id",authMiddleware, getOrderById);
router.get("/getorderhistory",authMiddleware, getOrderHistory);
router.get("/getrestaurantorders",authMiddleware, getRestaurantOrders);

router.put("/updateorderstatus/:id",authMiddleware, updateOrderStatus);
router.delete("/cancelorder/:id",authMiddleware, cancelOrder);



export default router;
