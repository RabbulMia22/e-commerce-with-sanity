"use client"

import { useState } from 'react'

export default function TestCheckoutPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testAPIAccess = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/checkout/create', {
        method: 'GET',
      })
      
      const data = await response.json()
      setResult(`API Access Test: ${JSON.stringify(data, null, 2)}`)
    } catch (error) {
      setResult(`API Access Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testCheckout = async () => {
    setLoading(true)
    setResult('')

    const testData = {
      items: [
        {
          product: {
            _id: 'test-product',
            title: 'Test Product',
            price: 10.99,
            image: null
          },
          quantity: 1
        }
      ],
      shippingInfo: {
        fullName: 'Test User',
        phoneNumber: '01712345678',
        district: 'dhaka',
        homeAddress: 'Test Address, Dhaka'
      },
      successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/basket`,
    }

    try {
      console.log('Testing with data:', testData)
      
      const response = await fetch('/api/debug-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Success! Session ID: ${data.sessionId}`)
      } else {
        setResult(`❌ Error: ${data.error}\nDetails: ${data.details || 'No details'}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Checkout API</h1>
      
      <div className="space-x-4">
        <button 
          onClick={testAPIAccess}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test API Access'}
        </button>
        
        <button 
          onClick={testCheckout}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Checkout Session Creation'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  )
}