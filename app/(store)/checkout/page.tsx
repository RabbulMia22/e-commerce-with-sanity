"use client"

import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import BangladeshShippingForm from '@/components/BangladeshShippingForm'
import { useHydratedStore } from '@/hooks/useHydratedStore'
import { imageUrl } from '@/sanity/lib/imageUrl'
import Image from 'next/image'

interface ShippingInfo {
  fullName: string
  phoneNumber: string
  district: string
  homeAddress: string
}

export default function CheckoutPage() {
  const { basket, getTotalPrice, hydrated } = useHydratedStore()
  const { user } = useUser()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPrice = hydrated ? getTotalPrice() : 0
  const itemsCount = hydrated ? basket.reduce((total, item) => total + item.quantity, 0) : 0
  const shippingCost = 0 // Free shipping to Bangladesh
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shippingCost + tax

  const handleShippingSubmit = async (shippingInfo: ShippingInfo) => {
    if (!user) {
      alert('Please sign in to proceed with checkout')
      return
    }

    if (basket.length === 0) {
      alert('Your basket is empty')
      router.push('/basket')
      return
    }

    setIsProcessing(true)

    try {
      console.log('Starting checkout process...');
      console.log('Basket items:', basket);
      console.log('Shipping info:', shippingInfo);
      
      // Create checkout session with Bangladesh shipping info
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: basket,
          shippingInfo,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/basket`,
        }),
      })

      const data = await response.json()
      
      console.log('API Response:', data);

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (data.error) {
        console.error('Checkout Error:', data.error);
        throw new Error(data.error)
      }

      if (!data.sessionId) {
        throw new Error('No session ID received from server')
      }

      // Redirect to Stripe Checkout
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      console.log('Stripe publishable key available:', !!publishableKey);
      console.log('Publishable key prefix:', publishableKey?.substring(0, 10) + '...');
      
      if (!publishableKey) {
        throw new Error('Stripe publishable key not found in environment variables')
      }
      
      const stripe = await import('@stripe/stripe-js').then(mod => 
        mod.loadStripe(publishableKey)
      )

      if (!stripe) {
        throw new Error('Failed to load Stripe - check publishable key')
      }
      
      console.log('Stripe loaded successfully');

      console.log('Redirecting to Stripe checkout with session:', data.sessionId);
      
      // The redirect should not return anything if successful
      // Only returns an error if there's a problem
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })
      
      console.log('Stripe redirect result:', result);
      
      // If we reach this point, there might be an error
      if (result && result.error) {
        throw new Error(`Stripe redirect error: ${result.error.message}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      
      let errorMessage = 'Failed to proceed to checkout. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`Checkout Error: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (basket.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your basket is empty</h1>
          <p className="text-gray-600 mb-6">Add some products to proceed with checkout</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/basket"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Basket
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order with delivery to Bangladesh</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {basket.map((item) => (
                  <div key={item.product._id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      {item.product.image && (
                        <Image
                          src={imageUrl(item.product.image).url()}
                          alt={item.product.title || 'Product'}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.product.title}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ${((item.product.price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemsCount} items)</span>
                  <span className="text-gray-800">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping to Bangladesh</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-800">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🇧🇩 Bangladesh Delivery</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Free delivery to all 64 districts</li>
                  <li>• 3-7 business days delivery</li>
                  <li>• Cash on delivery available</li>
                  <li>• Real-time order tracking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="order-1 lg:order-2">
            <BangladeshShippingForm 
              onSubmit={handleShippingSubmit}
              loading={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  )
}