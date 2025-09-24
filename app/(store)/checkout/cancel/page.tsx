"use client"

import React from 'react'
import { XCircle, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 border">
            {/* Cancel Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>

            {/* Cancel Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Your payment was cancelled. No charges were made to your account.
            </p>

            {/* Information */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What happened?</h2>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-700">You cancelled the payment process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-700">Your items are still safely stored in your basket</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-700">You can try again anytime or continue shopping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-700">No payment information was saved</span>
                </div>
              </div>
            </div>

            {/* Reassurance */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Don't worry!</strong> Your basket items are preserved and you can complete your purchase when you're ready.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/basket"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Return to Basket
              </Link>
              
              <Link 
                href="/"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you encountered any issues during checkout, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="mailto:support@yourstore.com" 
                  className="inline-flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Email Support
                </a>
                <a 
                  href="tel:+1234567890" 
                  className="inline-flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutCancelPage