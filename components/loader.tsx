import React from 'react'
import { Loader2 } from 'lucide-react';

function Loader() {
  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          {/* Spinning Lucide Icon */}
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
    
          {/* Loading text */}
          <p className="text-gray-700 text-lg font-medium">Loading...</p>
        </div>
  )
}

export default Loader