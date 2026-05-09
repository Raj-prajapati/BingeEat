import axiosInstance from "@/apis/axiosInstance";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSearchStore = create((set, get) => ({

  isSearching: false,
  clearSearch: () => {
    set({ restaurantSearchResult: [], menuItemSearchResult: [] });
  },
  searchAll: async (query) => {
    try {
      set({ isSearching: true });
      
      const [res1, res2] = await Promise.all([
        axiosInstance.get(`/restaurant/search?query=${query}`),
        axiosInstance.get(`/menuitem/search?query=${query}`),
      ]);
      console.log(res1,res2)
       const restaurants=res1.data
       const menuItems=res2.data
      return {
        restaurants ,menuItems
      };
     
    } catch (error) {
      
      toast.error(error.response?.data?.message || "Search Failed");
    } finally {
      set({ isSearching: false });
    }
  },
}));
