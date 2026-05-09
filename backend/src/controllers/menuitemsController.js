import Menuitems from "../models/menuitemsSchema.js";
import Restaurant from "../models/restaurantSchema.js";
import { ROLES } from "../utils/roles.js";

export const addmenuItems = async (req, res) => {
  try {
    const { name, price, isavailable, category, description, restaurantId } =
      req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({message:"enter a valid price"})
    };
    if (Number(price) <= 0) {
      return res.status(400).json({message:"enter a valid price"})
    };
    const imageUrls = req.files?.map((file) => file.path) || [];
    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const ownerid = req.user._id;
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      restaurantowner: ownerid,
    });
    if (!restaurant) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const addItem = new Menuitems({
      name: name,
      price: price,
      isavailable: isavailable,
      category: category,
      images: imageUrls,
      description: description,
      restaurantId: restaurantId,
    });
    await addItem.save();
    return res
      .status(201)
      .json({ message: "Item Added to the menu sccessfully" });
  } catch (error) {
    console.log(error.message, "error in addmenue controller");
    return res.status(500).json({
      message: "Could not add item to the menu , unexpected server error",
    });
  }
};

export const getMenuItems = async (req, res) => {
  try {
    const restaurantid = req.params.id;
    const menuitems = await Menuitems.find({
      restaurantId: restaurantid,
    });
    if (!menuitems) {
      return res.status(204).json({ message: "No Item to display" });
    }
    return res.status(200).json(menuitems);
  } catch (error) {
    console.log(error.message, "error in the addmenuitems controller ");
    return res.status(500).json({ message: "Not Found" });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    const menuItem = await Menuitems.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Item not Found" });
    }
    return res.status(200).json(menuItem);
  } catch (error) {
    console.log(error.message, "Error in getmenubyitem controller");
    return res.status(500).json({ message: "Unexpected error" });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const {
      description,
      name,
      restaurantId,
      price,
      isavailable,
      category,
      
      _id: itemId,
    } = req.body;
    const imageUrls=req.files?.map((file)=> file.path)||[]
    
    const ownerid = req.user._id;
    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ messgae: "Not Authorized" });
    }
    const restaurant = await Restaurant.findOne({
      restaurantowner: ownerid,
    });

    if (!restaurant) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const isvalid = await Menuitems.findOne({
      restaurantId: restaurantId,
      _id: itemId,
    });
    if (!isvalid) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const updateItem = await Menuitems.findByIdAndUpdate(
      itemId,
      { $set: { description, name, price, isavailable, category, images:imageUrls } },
      { new: true },
    );

    return res.status(200).json({ message: "Item Updated Successfully" });
  } catch (error) {
    console.log(error.message, "Error in update menuitems controller");
    return res.status(500).json({ messgae: "Unexpected error" });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ messgae: "Not Authorized" });
    }
    const ownerId = req.user._id;
    const restaurant = await Restaurant.findOne({ restaurantowner: ownerId });
    if (!restaurant) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    const restaurantId = restaurant._id;
    const menuId = req.params.id;
    const isValidRes = await Menuitems.findOne({
      restaurantId: restaurantId,
      _id: menuId,
    });
    if (!isValidRes) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const deleteMenu = await Menuitems.findByIdAndDelete(menuId);
    return res.status(200).json({ message: "Menu Item deleted successfully" });
  } catch (error) {
    console.log(error.message, "error in deleting menu");
    return res.status(500).json({ message: "Unexpected Erorr" });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const ownerid = req.user._id;
    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ messgae: "Not Authorized" });
    }
    const restaurant = await Restaurant.findOne({
      restaurantowner: ownerid,
    });

    if (!restaurant) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const restaurantId = restaurant._id;
    const itemId = req.params.id;
    const isvalid = await Menuitems.findOne({
      restaurantId: restaurantId,
      _id: itemId,
    });
    if (!isvalid) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const updateItem = await Menuitems.findByIdAndUpdate(
      itemId,
      { $set: { isavailable: !isvalid.isAvailable } },
      { new: true },
    );
    return res.status(200).json({ message: "Item availability Changed" });
  } catch (error) {
    console.log(error.message, "error in the toggleavailabilty ");
    return res.status(500).json({ message: "Unexpected Error" });
  }
};

export const searchMenuItems = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search input is required" });
    }

    const words = query.trim().split(" ");

    const regexConditions = words.flatMap((word) => [
      { name: { $regex: new RegExp(word, "i") } },
    ]);
    const data = await Menuitems.find({
      $or: regexConditions,
    }).populate("restaurantId");

    if (data.length === 0) {
      return res.status(404).json({ message: "No Items found found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error.message, "error in searchMenuItems");
    return res.status(500).json({ message: "Unexpected error" });
  }
};
