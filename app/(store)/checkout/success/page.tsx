"use client"

import React, { useEffect, useState } from 'react'
import { CheckCircle, Package, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import useBasketStore, { Order } from '@/store/store'
import { useSearchParams } from 'next/navigation'

function CheckoutSuccessPage() {
  const { clearBasket, getItems, getTotalPrice, addOrder } = useBasketStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderSaved, setOrderSaved] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Success page loaded');
    console.log('Session ID from URL:', sessionId);
    console.log('Current URL:', window.location.href);
  }, [sessionId]);

  useEffect(() => {
    if (sessionId && !orderSaved) {
      console.log('Processing order for session:', sessionId);
      
      // Get current basket before clearing
      const basketItems = getItems();
      const total = getTotalPrice();
      
      console.log('Basket items before clearing:', basketItems);
      console.log('Total price:', total);
      
      if (basketItems.length > 0) {
        // Create order object
        const order: Order = {
          id: sessionId,
          orderNumber: `ORD-${Date.now().toString().slice(-8).toUpperCase()}`,
          items: basketItems,
          total: total,
          status: 'processing',
          orderDate: new Date().toISOString(),
          sessionId: sessionId,
        };

        // Save order to store
        addOrder(order);
        setOrderSaved(true);
        
        console.log('Order saved successfully:', order);
      } else {
        console.log('No items in basket, order not created');
      }
      
      // Clear the basket after successful payment
      clearBasket();
      console.log('Basket cleared after payment');
    } else if (!sessionId) {
      console.log('No session ID found in URL');
    } else if (orderSaved) {
      console.log('Order already saved, skipping');
    }
  }, [sessionId, clearBasket, getItems, getTotalPrice, addOrder, orderSaved]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 border">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Thank you for your purchase! Your order has been confirmed and will be processed shortly.
            </p>

            {/* Order Details */}
            {sessionId && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Order ID:</strong> {sessionId.slice(-12).toUpperCase()}
                </p>
              </div>
            )}

            {/* What's Next Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Package className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">What's Next?</h2>
              </div>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">You'll receive an email confirmation shortly</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Your order will be processed within 1-2 business days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Track your order in the "My Orders" section</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Estimated delivery: 3-7 business days</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/myOrder"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Package className="w-5 h-5 mr-2" />
                View My Orders
              </Link>
              
              <button className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-300">
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </button>
              
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>

            {/* Customer Support */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Contact our customer support at{' '}
                <a href="mailto:support@yourstore.com" className="text-blue-600 hover:underline">
                  support@yourstore.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccessPage