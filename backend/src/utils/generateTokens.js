import User from "../models/userModel.js";

export const generateTokens  = async (userId) => {
    try {
        const  user=await User.findById(userId)
   if(user){
    const accessToken= user.generateAccessToken();
    const refreshToken= user.generateRefreshToken();

      user.refreshToken=refreshToken;

     await user.save({ validateBeforeSave: false })

     return   { accessToken, refreshToken }
     
   } else{
    throw new Error("User not found")
   }
   
  
    } catch (error) {
        console.log(error,"error in toke generator function in utils ")
    }
   
}
