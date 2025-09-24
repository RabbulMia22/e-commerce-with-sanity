"use client"

import { useState } from 'react'

export default function TestSessionPage() {
  const [sessionId, setSessionId] = useState('cs_test_b1avTfb3jUdSyCb3qcPLkuMmpaahCKDswmVslMGeRAbIaFFD4XNBTwTAsk')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testSession = async () => {
    setLoading(true)
    setResult('')

    try {
      const response = await fetch(`/api/test-session?sessionId=${sessionId}`)
      const data = await response.json()
      
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test Session Retrieval</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Session ID:</label>
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter Stripe session ID"
          />
        </div>
        
        <button 
          onClick={testSession}
          disabled={loading || !sessionId}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Session Retrieval'}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">{result}</pre>
        </div>
      )}
    </div>
  )
}