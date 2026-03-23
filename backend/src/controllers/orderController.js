import Order from "../models/orderSchema.js";
import Cart from "../models/cartSchema.js";
import Restaurant from "../models/restaurantSchema.js";
import { ROLES } from "../utils/roles.js";

export const placeOrder = async (req, res) => {
  try {
    const { restaurantId, address, paymentMethod } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.menuItem",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const items = cart.items;

    const totalPrice = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const userOrder = new Order({
      user: userId,
      items: items,
      restaurant: restaurantId,
      deliveryAddress: address,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
    });

    await userOrder.save();
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    return res.status(201).json({ message: "Order placed" });
  } catch (error) {
    console.log(error.message, "error in the place order controller");
    return res
      .status(500)
      .json({ message: "error in the place order backend" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;
    const preOrder = await Order.findOne({
      user: userId,
      _id: orderId,
    }).populate("items.menuItem");
    if (!preOrder) {
      return res.status(404).json({ message: "No Order found" });
    }
    return res.status(200).json(preOrder);
  } catch (error) {
    console.log(error.message, "Error in the get order by id ");
    return res.status(500).json({ message: "Unexpected error" });
  }
};

export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderHistory = await Order.find({ user: userId }).populate(
      "items.menuItem",
    );
    if (orderHistory.length == 0) {
      return res.status(404).json({ message: "No Order found" });
    }
    return res.status(200).json(orderHistory);
  } catch (error) {
    console.log(error.message, "Error in the get order ");
    return res.status(500).json({ message: "Unexpected error" });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const ownerId = req.user._id;
    if (req.user.role !== ROLES.RESTAURANT_OWNER)
      return res.status(403).json({ message: "Unauthorized" });
    const restaurant = await Restaurant.findOne({ restaurantowner: ownerId });
    if (!restaurant) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const restaurantId = restaurant._id;
    const orders = await Order.find({ restaurant: restaurantId })
      .populate("items.menuItem")
      .populate("user");

    if (orders.length == 0) {
      return res.status(404).json({ message: "No Orders Yet" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error.message, "Error in the getrestaurant orders controller");
    return res.status(500).json({ message: "Unexpected Erorr" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const orderId = req.params.id;
    const { status } = req.body;

    if (req.user.role !== ROLES.RESTAURANT_OWNER) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const restaurant = await Restaurant.findOne({ restaurantowner: ownerId });
    if (!restaurant)
      return res.status(404).json({ message: "No restaurant found" });
    const restaurantId = restaurant._id;
    const isValidOrder = await Order.findOneAndUpdate(
      { restaurant: restaurantId, _id: orderId },
      { status: status },
      { new: true },
    );
    if (!isValidOrder)
      return res.status(404).json({ message: "No Order found " });
    return res
      .status(200)
      .json({ message: "Order staus upadted successfully" });
  } catch (error) {
    console.log(
      error.message,
      "error in updating the order status controller ",
    );
    return res.status(500).json({ message: "Unexpected Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    const order = await Order.findOne({ user: userId, _id: orderId });
    if (!order) return res.status(404).json({ message: "No Order found" });
    if (
      order.status === "out for delivery" ||
      order.status === "preparing" ||
      order.status === "delivered"
    ) {
      return res
        .status(400)
        .json({ message: "Can not cancel this order " });
    }

    await Order.findOneAndUpdate(
      { _id: orderId },
      { status: "cancelled" },
      { new: true },
    );

    return res.status(200).json({message:"Order Cancelled"})
  } catch (error) {
    console.log(error.message, "Error in the cancel order controller");
    return res.status(500).json({ message: "Unepected error" });
  }
};
