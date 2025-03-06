"use client";
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist } from "zustand/middleware";
import { AlertTriangle } from "lucide-react";

const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      getUserKey: () => {
        // Get the user ID from localStorage (set during sign-in)
        const userId =
          typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        return userId || "anonymous";
      },
      setItems: (items) => {
        set({ items });
      },
      addItem: (data) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast("Item already in cart.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },
      removeItem: (id) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      // Use user ID in storage key to separate cart data by user
      getStorage: () => ({
        setItem: (name, value) => {
          const userKey = `${name}-${useCart.getState().getUserKey()}`;
          return localStorage.setItem(userKey, value);
        },
        getItem: (name) => {
          const userKey = `${name}-${useCart.getState().getUserKey()}`;
          return localStorage.getItem(userKey);
        },
        removeItem: (name) => {
          const userKey = `${name}-${useCart.getState().getUserKey()}`;
          return localStorage.removeItem(userKey);
        },
      }),
    }
  )
);

export default useCart;
