"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import useCart from "@/hooks/use-cart";

const AuthCheck = () => {
  const { userId, isLoaded } = useAuth();
  const { items, setItems } = useCart((state) => ({
    items: state.items,
    setItems: state.setItems,
  }));

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        // Get anonymous cart items before setting new userId
        const anonymousKey = "cart-storage-anonymous";
        const anonymousCart = localStorage.getItem(anonymousKey);
        const anonymousItems = anonymousCart
          ? JSON.parse(anonymousCart).state.items
          : [];

        // Set the new userId
        localStorage.setItem("userId", userId);

        // Get existing user cart
        const userKey = `cart-storage-${userId}`;
        const userCart = localStorage.getItem(userKey);
        const userItems = userCart ? JSON.parse(userCart).state.items : [];

        // Merge carts: Add items from anonymous cart that aren't in user cart
        const mergedItems = [...userItems];
        anonymousItems.forEach((anonymousItem: any) => {
          if (!mergedItems.some((item) => item.id === anonymousItem.id)) {
            mergedItems.push(anonymousItem);
          }
        });

        // Update cart with merged items
        setItems(mergedItems);

        // Clean up anonymous cart
        localStorage.removeItem(anonymousKey);
      } else {
        localStorage.removeItem("userId");
      }
    }
  }, [userId, isLoaded, setItems]);

  return null;
};

export default AuthCheck;
