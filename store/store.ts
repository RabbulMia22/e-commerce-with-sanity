import { Product } from "@/sanity.types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface BasketItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    items: BasketItem[];
    total: number;
    status: 'processing' | 'shipped' | 'delivered';
    orderDate: string;
    sessionId: string;
}

interface BasketState {
    basket: BasketItem[];
    orders: Order[];
    addToBasket: (product: Product) => void;
    removeFromBasket: (productId: string) => void;
    removeItemCompletely: (productId: string) => void;
    clearBasket: () => void;
    getTotalPrice: () => number;
    getItemCount: (productId: string) => number;
    getItems: () => BasketItem[];
    addOrder: (order: Order) => void;
    getOrders: () => Order[];
}

 const useBasketStore = create<BasketState>()(
    persist(
        (set, get) => ({
            basket: [],
            orders: [],
            addToBasket: (product: Product) => {
                const existingIndex = get().basket.findIndex(item => item.product._id === product._id);
                if (existingIndex >= 0) {
                    const updatedBasket = [...get().basket];
                    updatedBasket[existingIndex].quantity += 1;
                    set({ basket: updatedBasket });
                } else {
                    set({ basket: [...get().basket, { product, quantity: 1 }] });
                }
            },
            removeFromBasket: (productId: string) => {
                const existingIndex = get().basket.findIndex(item => item.product._id === productId);
                if (existingIndex >= 0) {
                    const updatedBasket = [...get().basket];
                    if (updatedBasket[existingIndex].quantity > 1) {
                        updatedBasket[existingIndex].quantity -= 1;
                    } else {
                        updatedBasket.splice(existingIndex, 1);
                    }
                    set({ basket: updatedBasket });
                }
            },
            removeItemCompletely: (productId: string) => {
                const updatedBasket = get().basket.filter(item => item.product._id !== productId);
                set({ basket: updatedBasket });
            },
            clearBasket: () => set({ basket: [] }),
            getTotalPrice: () =>
                get().basket.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0),
            getItemCount: (productId: string) => {
                const item = get().basket.find(item => item.product._id === productId);
                return item ? item.quantity : 0;
            },
            getItems: () => get().basket,
            addOrder: (order: Order) => {
                set({ orders: [order, ...get().orders] });
            },
            getOrders: () => get().orders,
        }),
        { name: "basket-orders-storage" }
    )
);

export default useBasketStore;
