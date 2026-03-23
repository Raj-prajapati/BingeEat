import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menuitems",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: {
        house: String,
        street: String,
        city: String,
        pincode: String,
      },
      required: true,
    },
    status: {
      type: String,
      enum: ["delivered", "placed", "out for delivery", "preparing","cancelled"],
      default: "placed",
    },
    paymentstatus: {
      type: String,
      enum: ["paid", "unpaid", "cash on delivery"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["online", "cash on delivery"],
      required: true,
    },
  },

  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
