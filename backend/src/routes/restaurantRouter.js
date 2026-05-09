import express from "express";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
  searchRestaurants,

} from "../controllers/restaurantController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/createrestaurant",authMiddleware,upload.array("images",5), createRestaurant);
router.delete("/deleterestaurant",authMiddleware, deleteRestaurant);
router.get("/getrestaurantById/:id", getRestaurantById);
router.get("/getrestaurants", getRestaurants);
router.put("/updaterestaurant",authMiddleware,upload.array("images",5), updateRestaurant);
router.get("/search", searchRestaurants)



export default router;
