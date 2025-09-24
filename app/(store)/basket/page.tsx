"use client"

import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard, Gift, Truck, Shield } from 'lucide-react'
import { imageUrl } from '@/sanity/lib/imageUrl'
import { createSessionCheckout } from '@/action/createSeassionCheckout'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { useHydratedStore } from '@/hooks/useHydratedStore'

function BasketPage() {
  const { 
    basket, 
    addToBasket, 
    removeFromBasket, 
    removeItemCompletely,
    clearBasket, 
    getTotalPrice, 
    getItemCount,
    getItems,
    hydrated
  } = useHydratedStore();

  const { user } = useUser();


  // Only calculate after hydration to prevent hydration mismatch
  const totalPrice = hydrated ? getTotalPrice() : 0;
  const itemsCount = hydrated ? basket.reduce((total, item) => total + item.quantity, 0) : 0;
  const shippingCost = totalPrice > 100 ? 0 : 15;
  const tax = totalPrice * 0.08; 
  const finalTotal = totalPrice + shippingCost + tax;

  // Handle checkout redirect to Bangladesh shipping form
  const handleCheckout = () => {
    if (!user) {
      alert('Please sign in to proceed with checkout');
      return;
    }

    if (basket.length === 0) {
      alert('Your basket is empty');
      return;
    }

    // Redirect to the checkout page with Bangladesh shipping form
    window.location.href = '/checkout';
  };

  // Show loading state while hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 border">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6 animate-pulse" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Your Cart...</h1>
              <p className="text-gray-600 text-lg">
                Please wait while we load your shopping cart.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (basket.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 border">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8 text-lg">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
              <p className="text-gray-600">
                {itemsCount} {itemsCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <Link 
              href="/"
              className="flex items-center px-6 py-3 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                <button 
                  onClick={clearBasket}
                  className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear Cart
                </button>
              </div>

              <div className="space-y-6">
                {basket.map((item) => {
                  const product = item.product;
                  return (
                    <div key={product._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 relative rounded-lg overflow-hidden bg-gray-100">
                          {product.image ? (
                            <Image
                              src={imageUrl(product.image).url()}
                              alt={product.title || 'Product'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {product.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Premium quality product
                            </p>
                            <div className="mt-2">
                              <span className="text-2xl font-bold text-blue-600">
                                ${product.price?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls and Delete */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button 
                                onClick={() => removeFromBasket(product._id || '')}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                title="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-semibold">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => addToBasket(product)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                title="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => removeItemCompletely(product._id || '')}
                              className="flex items-center justify-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                              title="Remove item completely"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            {/* Price */}
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${((product.price || 0) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                    <p className="text-sm text-gray-600">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                    <p className="text-sm text-gray-600">SSL encrypted</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                    <p className="text-sm text-gray-600">30-day policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({itemsCount} items)</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={basket.length === 0 || !user}
                className={`w-full mt-6 flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                  basket.length === 0 || !user
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {!user ? 'Sign In to Checkout' : '🇧🇩 Checkout (Bangladesh Delivery)'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasketPage;