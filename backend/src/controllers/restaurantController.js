import Restaurant from "../models/restaurantSchema.js";
import { ROLES } from "../utils/roles.js";

export const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const userId = req.user._id;
    const existingRestaurant = await Restaurant.findOne({
      restaurantowner: userId,
    });
    if (existingRestaurant) {
      return res
        .status(403)
        .json({ message: "Restaurant Alredy Exist From This Owner" });
    }
    const {
      description,
      restaurantname,
      cuisine,
      addresses,
      contact,
      deliveryTime,
    } = req.body;
    const imageUrls=req.files?.map((file)=>file.path)||[];
    const restaurant = new Restaurant({
      restaurantowner: userId,
      description: description,
      contact: contact,
      restaurantname: restaurantname,
      addresses: addresses,
      cuisine: cuisine,
      deliveryTime: deliveryTime,
      images:imageUrls
    });
    await restaurant.save();
    return res.status(201).json({
      success: true,
      message: "Restaurant Created Successfully",
    });
  } catch (error) {
    console.log("error in restaurant creation", error.message);
    return res.status(500).json({ message: "Failed to create restaurant" });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json(restaurants);
  } catch (error) {
    console.log("error in fetching restaurant ");
    return res.status(500).json({ message: "Could not find any restaurant" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant Does not exists anymore" });
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    console.log("error in get restaurant by id controller");
    return res
      .status(500)
      .json({ message: "Could not get restaurant details" });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const ownerId = req.user._id;
    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const {
      restaurantname,
      description,
      cuisine,
      contact,
      address,
      deliveryTime,
      deliveryFee,
      minimumOrder,
      isOpen,
    
      avatar,
    } = req.body;
      const imageUrls=req.files?.map((file)=>file.path)||[];
    const existingRestaurant = await Restaurant.findOne({
      restaurantowner: ownerId,
    });
    if (!existingRestaurant) {
      return res.status(403).json({ message: "Restaurant Does Not Exists" });
    }
    const updateRestaurant = await Restaurant.findOneAndUpdate(
      {
        restaurantowner: ownerId,
      },
      {
        $set: {
          description,
          cuisine,
          restaurantname,
          deliveryFee,
          deliveryTime,
          minimumOrder,
          contact,
          address,
          images:imageUrls,
          isOpen,
          avatar,
        },
      },
      { new: true, runValidators: true },
    );

    return res
      .status(200)
      .json({ message: "Restaurant Details Updated Successfully" });
  } catch (error) {
    console.log(error, "error in updating the restaurant backend");
    return res.status(500).json({ message: "Could not update the restaurant" });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const ownerId = req.user._id;
    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const restaurant = await Restaurant.findOneAndDelete({
      restaurantowner: ownerId,
    });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    return res.status(200).json({
      message: "Restaurant Deleted Successfully Thank you for Serving Us",
    });
  } catch (error) {
    console.log(error, "error in deleterestaurant");
    return res
      .status(500)
      .json({ message: "Error in deleting the restaurant" });
  }
};

export const searchRestaurants = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search input is required" });
    }
    const words = query.trim().split(" ");

    const regexConditions = words.flatMap((word) => [
      { restaurantname: { $regex: new RegExp(word, "i") } },
      { cuisine: { $regex: new RegExp(word, "i") } },
    ]);
    const data = await Restaurant.find({
      $or: regexConditions
    });
    if (data.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }
    return res.status(200).json(data, { message: "Restaurant found " });
  } catch (error) {
    console.log(error.message, "error in RestarauntSearch");
    return res.status(500).json({ message: "Unexpected error" });
  }
};
