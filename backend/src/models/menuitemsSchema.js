import mongoose from "mongoose";


const menuitemSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    isavailable: {
      type: Boolean,
      default: true,
    },
    category:{
        type: String,
        enum:["starter","main course","dessert","drinks"]
    },
  
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

const Menuitems = mongoose.model("Menuitems", menuitemSchema);

export default Menuitems;
