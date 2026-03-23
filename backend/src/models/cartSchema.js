import mongoose from "mongoose";


const CartSchema = mongoose.Schema(
  {
  
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   items: [
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menuitems",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }
]
    
  },
  { timestamps: true },
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
