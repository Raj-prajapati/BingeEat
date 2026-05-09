import { create } from "zustand";

export const useAddressStore = create((set, get) => ({
  address: null,
  fullAddress: null,
  setAddress: (s) => set({ address: s }),
  setFullAddress: (fullAddress) => set({ fullAddress }),
  clearAddress: () => set({ address: null, fullAddress: null }),
}));
