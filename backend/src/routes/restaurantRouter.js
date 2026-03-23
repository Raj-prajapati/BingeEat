import express from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
} from "../controllers/restaurantController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createrestaurant",authMiddleware, createRestaurant);
router.delete("/deleterestaurant",authMiddleware, deleteRestaurant);
router.get("/getrestaurantById/:id", getRestaurantById);
router.get("/getrestaurants", getRestaurants);
router.put("/updaterestaurant",authMiddleware, updateRestaurant);



export default router;
