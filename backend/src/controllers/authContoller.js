import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
      phone,
    });

    await user.save();
    if (user) {
      return res.status(201).json({
        success: true,
        message: "Account created successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = await generateTokens(user._id);

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to Login" });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      refreshToken: "",
    });

    res.clearCookie("refreshToken", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("error in logout controller");
    return res.status(500).json({ message: "Failed to logout" });
  }
};

export const refreshAccessToken = async (req, res) => {
 try {
   if (!req.cookies.refreshToken) {
    return res.status(400).json({ message: "unauthorized" });
  }

  const currentRefreshToken = req.cookies.refreshToken;

  const decodedToken = jwt.verify(
    currentRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );
  console.log(decodedToken);
  const userId = decodedToken._id;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.refreshToken !== currentRefreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { accessToken, refreshToken } = await generateTokens(userId);
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      accessToken: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
 } catch (error) {
  console.log("error in refreshaccesstoken controller ")
  res.status(400).json({message:"unauthorized user"})
 }
};


export const saveAddress =async (req,res) => {
  try {
    const{address}=req.body;
    const userId=req.user._id
    await User.findByIdAndUpdate(userId,{$push:{addresses:address}})
     return res.status(200).json({message:'Address saved successfully'})
  } catch (error) {
    console.log(error.message,"erorr in saving address controller")
    return res.status(500).json({message:"Unexpected Error"})
  }
  
}


export const removeAddress =async (req,res) => {
  try {
    const addressId=req.params.id;
    const userId=req.user._id
    await User.findByIdAndUpdate(userId,{$pull:{addresses:{_id:addressId}}})
     return res.status(200).json({message:'Address removed successfully'})
  } catch (error) {
    console.log(error.message,"erorr in removing address controller")
    return res.status(500).json({message:"Unexpected Error"})
  }
  
}




