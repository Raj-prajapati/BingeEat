import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
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
    role: {
      type: String,
      enum: ["customer", "restaurant_owner"],
      default: "customer",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    
    },

    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

const User = mongoose.model("User", userSchema);

export default User;
