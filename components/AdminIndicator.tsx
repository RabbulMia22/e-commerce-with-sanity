"use client"

import { useUser } from '@clerk/nextjs'
import { Shield } from 'lucide-react'
import Link from 'next/link'

const ADMIN_EMAILS = [
  'mdr191700@gmail.com',
  'rabbulmia22@gmail.com',
];

export default function AdminIndicator() {
  const { user } = useUser();
  
  if (!user) return null;
  
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();
  const isAdmin = ADMIN_EMAILS.includes(userEmail || '');
  
  if (!isAdmin) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/admin"
        className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
        title="Admin Dashboard"
      >
        <Shield className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      
      <Link
        href="/studio"
        className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
        title="Access Sanity Studio"
      >
        <Shield className="w-4 h-4" />
        <span>Studio</span>
      </Link>
    </div>
  );
}