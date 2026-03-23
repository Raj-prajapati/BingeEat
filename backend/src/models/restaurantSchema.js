import mongoose from "mongoose";


const restaurantSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    restaurantname: {
      type: String,
      required: true,
    },
    restaurantowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      default:0,
    },
    isopen: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
    },
    cuisine: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],

    addresses: [
      {
        label: String,
        house: String,
        street: String,
        city: String,
        pincode: String,
        isDefault: Boolean,
      },
    ],

    deliveryTime: { type: Number, required: true },

    minimumOrder: { type: Number, default: 0 },

    deliveryFee: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
