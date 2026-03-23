import axiosInstance from "@/apis/axiosInstance";
import toast from "react-hot-toast";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,

  getCart: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/cart/getcart");
      set({ cart: res.data });
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to Get cart ";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (itemId, quantity, price) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/cart/addtocart", {
        itemId,
        price,
        quantity,
      });
      toast.success("Items added to cart ");

      await get().getCart();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to add the items to cart ";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (itemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete(`/cart/removefromcart/${itemId}`);

      await get().getCart();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to remove the items to cart ";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
       set({isLoading:true});
       const res=await axiosInstance.put("/cart/updatecart",{itemId,quantity})
       toast.success("Cart Updated Successfully")
       await get().getCart();

    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to Update the items cart ";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart:async () => {
    try {
      set({isLoading:true})
      await axiosInstance.delete("/cart/clearcart")
      toast.success("Cart Cleared")
      await get().getCart();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to Update the items cart ";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  }
}));
