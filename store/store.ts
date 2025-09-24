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
    cleanupDuplicateOrders: () => void;
    clearAllOrders: () => void;
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
                const existingOrders = get().orders;
                
                // Check for duplicates by both ID and sessionId
                const duplicateBySessionId = existingOrders.some(
                    existingOrder => existingOrder.sessionId === order.sessionId
                );
                const duplicateById = existingOrders.some(
                    existingOrder => existingOrder.id === order.id
                );
                
                if (!duplicateBySessionId && !duplicateById) {
                    set({ orders: [order, ...existingOrders] });
                    console.log('Order added successfully:', order.id);
                } else {
                    console.log('Duplicate order prevented:', {
                        orderId: order.id,
                        sessionId: order.sessionId,
                        duplicateBySessionId,
                        duplicateById
                    });
                }
            },
            getOrders: () => get().orders,
            cleanupDuplicateOrders: () => {
                const orders = get().orders;
                const uniqueOrders = orders.filter((order, index, self) => {
                    // Keep the first occurrence of each unique sessionId
                    return index === self.findIndex(o => o.sessionId === order.sessionId);
                });
                
                if (uniqueOrders.length !== orders.length) {
                    console.log(`Cleaned up ${orders.length - uniqueOrders.length} duplicate orders`);
                    set({ orders: uniqueOrders });
                }
            },
            clearAllOrders: () => {
                console.log('Clearing all orders from storage');
                set({ orders: [] });
            },
        }),
        { name: "basket-orders-storage" }
    )
);

export default useBasketStore;
