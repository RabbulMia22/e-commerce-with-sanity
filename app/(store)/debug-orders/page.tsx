"use client"

import { useState } from 'react'
import { useHydratedStore } from '@/hooks/useHydratedStore'

export default function DebugOrdersPage() {
  const { getOrders, cleanupDuplicateOrders, clearAllOrders } = useHydratedStore()
  const [result, setResult] = useState('')

  const showOrders = () => {
    const orders = getOrders()
    setResult(`Total Orders: ${orders.length}\n\n` + 
              orders.map((order, index) => 
                `${index + 1}. ID: ${order.id}\n   Session: ${order.sessionId}\n   Order#: ${order.orderNumber}\n`
              ).join('\n'))
  }

  const handleCleanup = () => {
    const beforeCount = getOrders().length
    cleanupDuplicateOrders()
    const afterCount = getOrders().length
    setResult(`Cleanup completed!\nBefore: ${beforeCount} orders\nAfter: ${afterCount} orders\nRemoved: ${beforeCount - afterCount} duplicates`)
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all orders? This cannot be undone.')) {
      clearAllOrders()
      setResult('All orders cleared from storage')
    }
  }

  const checkForDuplicates = () => {
    const orders = getOrders()
    const sessionIds = orders.map(order => order.sessionId)
    const duplicateSessions = sessionIds.filter((session, index) => sessionIds.indexOf(session) !== index)
    const uniqueDuplicates = [...new Set(duplicateSessions)]
    
    if (uniqueDuplicates.length === 0) {
      setResult('No duplicate session IDs found ✅')
    } else {
      setResult(`Found ${uniqueDuplicates.length} duplicate session IDs:\n\n${uniqueDuplicates.join('\n')}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Orders</h1>
      
      <div className="space-x-4 mb-6">
        <button 
          onClick={showOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Show All Orders
        </button>
        
        <button 
          onClick={checkForDuplicates}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Check for Duplicates
        </button>
        
        <button 
          onClick={handleCleanup}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Cleanup Duplicates
        </button>
        
        <button 
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear All Orders
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