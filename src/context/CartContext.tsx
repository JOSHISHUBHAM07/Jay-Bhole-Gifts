"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export interface CartItem {
    id: string; // Unique ID for the cart line item (includes customization)
    product: CartProduct;
    quantity: number;
    customization?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: CartProduct, quantity: number, customization?: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem("giftaura_cart");
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart from local storage", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("giftaura_cart", JSON.stringify(cartItems));
        }
    }, [cartItems, isLoaded]);

    const addToCart = (product: CartProduct, quantity: number = 1, customization?: string) => {
        setCartItems((prevItems) => {
            // Check if exact same item (same product ID + same customization) exists
            const existingItemIndex = prevItems.findIndex(
                (item) => item.product.id === product.id && item.customization === customization
            );

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Add new item
                const newItemId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                return [...prevItems, { id: newItemId, product, quantity, customization }];
            }
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
