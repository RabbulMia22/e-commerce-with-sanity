import Link from 'next/link';
import { ArrowLeft, Package, Search } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-12">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Package className="w-12 h-12 text-blue-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
          </div>
          
          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Oops! The product you're looking for doesn't exist or may have been removed from our store.
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse All Products
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
        
        {/* Additional Help */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 text-sm mb-4">
            If you believe this is an error, please contact our support team.
          </p>
          <Link 
            href="/contact" 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}