import express from "express";
import {
  addmenuItems,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  toggleAvailability,
  updateMenuItem,
} from "../controllers/menuitemsController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addmenuitems",authMiddleware, addmenuItems);
router.delete("/deletemenuitem/:id",authMiddleware, deleteMenuItem);
router.get("/getmenuitembyid/:id", getMenuItemById);
router.get("/getmenuitems/:id", getMenuItems);
router.put("/updatemenuitem",authMiddleware, updateMenuItem);
router.patch("/toggleavailability",authMiddleware, toggleAvailability);



export default router;
