"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldX, Home, User } from 'lucide-react'

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  if (error === 'unauthorized') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            {/* Warning Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldX className="w-12 h-12 text-red-500" />
            </div>

            {/* Error Message */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">
                You don't have permission to access the Sanity Studio. Only administrators can access this area.
              </p>
              
              {/* Contact Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Need admin access?</strong><br />
                  Contact the site administrator to get your email added to the admin list.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Store
                </Link>
                
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign In with Different Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}