import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "food-delivery-app/others";

    // 🔥 dynamic folder logic
    if (req.baseUrl.includes("restaurant")) {
      folder = "food-delivery-app/restaurants";
    } else if (req.baseUrl.includes("menu")) {
      folder = "food-delivery-app/menu-items";
    } else if (req.baseUrl.includes("user")) {
      folder = "food-delivery-app/users";
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg"],
    };
  },
});

const upload = multer({ storage });

export default upload;