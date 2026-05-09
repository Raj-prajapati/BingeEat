import express from "express";
import {
  addmenuItems,
  deleteMenuItem,
  getMenuItemById,
  getMenuItems,
  toggleAvailability,
  updateMenuItem,
  searchMenuItems
} from "../controllers/menuitemsController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/addmenuitems",authMiddleware,upload.array("images",5), addmenuItems);
router.delete("/deletemenuitem/:id",authMiddleware, deleteMenuItem);
router.get("/getmenuitembyid/:id", getMenuItemById);
router.get("/getmenuitems/:id", getMenuItems);
router.put("/updatemenuitem",authMiddleware, upload.array("images",5),updateMenuItem);
router.patch("/toggleavailability",authMiddleware, toggleAvailability);
router.get("/search", searchMenuItems)



export default router;
