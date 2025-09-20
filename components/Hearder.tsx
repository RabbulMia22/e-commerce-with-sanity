"use client"

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import React from "react";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";

function Header() {
  const { user } = useUser();
  

  const createPassKey = async () => {
    try {
      const res = await user?.createPasskey();
      console.log("Passkey created:", res);
    } catch (error) {
      console.error("Error creating passkey:", JSON.stringify(error, null, 2));
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-4 py-3">
        {/* Logo / Brand */}
        <Link
          href="/shop"
          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent hover:opacity-80 transition"
        >
          Shop
        </Link>

        {/* Search Bar */}
        <Form
          action="/search"
          className="w-full sm:flex-1 sm:max-w-md mt-3 sm:mt-0 sm:mx-6"
        >
          <input
            type="text"
            name="query"
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </Form>

        {/* Right Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
          {/* Basket */}
          <Link
            href="/basket"
            className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                       font-medium px-4 py-2 rounded-lg shadow-md 
                       hover:from-blue-600 hover:to-blue-700 hover:shadow-lg 
                       transition duration-300"
          >
            <TrolleyIcon className="w-5 h-5 mr-2" />
            My Basket
          </Link>

          {/* Orders (only signed in) */}
          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                           font-medium px-4 py-2 rounded-lg shadow-md 
                           hover:from-blue-600 hover:to-blue-700 hover:shadow-lg 
                           transition duration-300"
              >
                <PackageIcon className="w-5 h-5 mr-2" />
                My Orders
              </Link>
            </SignedIn>

            {/* User info */}
            {user ? (
              <div className="flex items-center space-x-3">
                <UserButton afterSignOutUrl="/" />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-500">Welcome Back</p>
                  <p className="font-bold text-gray-700">{user.fullName}</p>
                </div>
              </div>
            ) : (
              <SignInButton>
                <button className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 font-medium hover:bg-blue-50 transition">
                  Sign In
                </button>
              </SignInButton>
            )}

            {/* Create Passkey */}
            {user?.passkeys.length === 0 && (
              <button
                onClick={createPassKey}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Create Passkey
              </button>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}

export default Header;
