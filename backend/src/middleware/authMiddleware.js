import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.split(" ")[1];

    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = verified;
    next();
  } catch (error) {
    console.log("error in auth middleware backend ");
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
