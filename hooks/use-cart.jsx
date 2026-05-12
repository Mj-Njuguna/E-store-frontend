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
          set({
            items: currentItems.map((item) =>
              item.id === data.id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            ),
          });
          return toast.success("Quantity updated.");
        }

        set({ items: [...get().items, { ...data, quantity: 1 }] });
        toast.success("Item added to cart.");
      },
      removeItem: (id) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Item removed from cart.");
      },
      incrementItem: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
          ),
        });
      },
      decrementItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        if ((item.quantity || 1) <= 1) {
          set({ items: get().items.filter((i) => i.id !== id) });
          toast.success("Item removed from cart.");
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        }
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
