import Cart from "../models/cartSchema.js";
import { ROLES } from "../utils/roles.js";

export const addToCart = async (req, res) => {
  try {
    const { _id: itemId, quantity, price,  } = req.body;
    if (req.user.role !== ROLES.CUSTOMER) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    const userId = req.user._id;
    const existingCart = await Cart.findOne({ user: userId });

    if (existingCart) {
      await Cart.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            items: {
              menuItem: itemId,
              quantity: quantity,
              price: price,
            },
          },
        },
        { new: true },
      );
    }
    if (!existingCart) {
      const addItem = new Cart({
        user: userId,
        items: [
          {
            menuitem: itemId,
            quantity: quantity,
            price: price,
          },
        ],
      });
      await addItem.save();
    }

    return res.status(201).json({ message: "Items added to the cart" });
  } catch (error) {
    console.log(error.message, "Error in add to cart controller");
    return res.status(500).json({ message: "Unexpected Error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const items = await Cart.findOne({ user: userId }).populate(
      "items.menuItem",
    );

    if (!items) {
      return res
        .status(200)
        .json({
          Message:
            "No items in the card order something we are waiting for you",
        });
    }

    return res.status(200).json(items);
  } catch (error) {
    console.log(error.message, "error in get cart controller ");
    return res.status(500).json({ message: "unexpected error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId=req.params.id;
    const removeItem=await Cart.findOneAndUpdate({user:userId},{pull:{items:{_id:itemId}}},{new:true})
    if(!removeItem){
        return res.status(404).json({message:"No items found"})
    }
    return res.status(200).json({message:"item removed from the cart "})
    
  } catch (error) {
    console.log(error.messgae, "error in remove cart");
    return res.status(500).json({message:"Unexpected Error"})
  }
};

export const updateCart=async (req,res) => {
    try {
        const userId=req.user._id;
        const {quantity,_id:itemId}=req.body
        const existingCart=await Cart.findOneAndUpdate({user:userId,"items._id":itemId},{ $set: { "items.$.quantity": quantity } },{new:true})
        if(!existingCart){
            return res.status(404).json({message:"Please add an item first"})
        }
        return res.status(200).json({message:"Items added successfully"})
    } catch (error) {
        console.log(error.message,"Error in updatecart controller")
        return res.status(500).json({message:"Unexpected Error"})
    }
    
}

export const clearCart =async (req,res) => {
    try {
        const userId=req.user._id;
        await Cart.findOneAndUpdate({user:userId},{$set:{items:[]},},{new:true})
        return res.status(200).json({message:"Cart is empty"})
    } catch (error) {
        console.log(error.message,"error in the clear cart controller")
        return res.status(500).json({message:"Unexpected Error"})
        
    }
    
}