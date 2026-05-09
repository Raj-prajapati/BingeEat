import axiosInstance from "@/apis/axiosInstance";

import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set,get)=>({
  user: null,
  accessToken: null,
  isLoading: false,
  isSigningUp: false,
  isLoggingIn:false,

  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),


  signUp: async (name,email,password,phone) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup",{name,email,password,phone});

      toast.success("SignUp Succefull! Please Login");
    } catch (error) {
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(message);
    } finally{
        set({isSigningUp:false})
    }
  },
    
  login: async (email,password) => {
    try {
        set({isLoggingIn:true})
        const res=await axiosInstance.post("/auth/login",{email,password})
        get().setAuth(res.data.accessToken,res.data.user);
        toast.success("Login successfull")
    } catch (error) {
        const message=error?.response?.data?.message||"Login failed"
        toast.error(message)
    } finally{
      set({isLoggingIn:false})
    }
},

logout: async () => {
  try {
    const res=await axiosInstance.post("/auth/logout")
    get().clearAuth();
    toast.success("Logout Successfull")
  } catch (error) {
    const message=error?.response?.data?.message ||"Logout failed"
    toast.error(message)
  }
},

saveAddress:async (address) => {
  try {
    set({isLoading:true})
    await axiosInstance.patch("/auth/saveaddress",{address})
    toast.success("Address Saved from store")
    
  } catch (error) {
    const message=error?.response?.data?.message ||"Could not save the address from store"
    toast.error(message)
  } finally{
      set({isLoading:false})
    }
},

 removeAddress:async (addressId) => {
  try {
    set({isLoading:true})
    await axiosInstance.delete(`/auth/removeaddress/${addressId}`)
    toast.success("Address removed")
    
  } catch (error) {
    const message=error?.response?.data?.message ||"Could not remove the address"
    toast.error(message)
  } finally{
      set({isLoading:false})
    }
}

}));


