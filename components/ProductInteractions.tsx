'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Share, Plus, Minus } from 'lucide-react';
import { Product } from '@/sanity.types';

interface ProductInteractionsProps {
  product: Product;
  isOutOfStock: boolean;
  stockLevel: number;
}

export default function ProductInteractions({ product, isOutOfStock, stockLevel }: ProductInteractionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= stockLevel) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    setIsAddingToCart(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Adding ${quantity} of ${product.title} to cart`);
      // TODO: Implement actual add to cart functionality
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist: ${product.title}`);
    // TODO: Implement actual wishlist functionality
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title || 'Product',
          text: `Check out this amazing product: ${product.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // TODO: Show toast notification
        console.log('Link copied to clipboard');
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-900">
            Quantity
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-6 py-3 text-lg font-semibold bg-gray-50 min-w-[60px] text-center">
                {quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= stockLevel}
                className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <span className="text-gray-500">of {stockLevel} available</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className={`col-span-1 sm:col-span-2 flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isOutOfStock || isAddingToCart
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
        >
          <ShoppingCart className={`w-6 h-6 mr-3 ${isAddingToCart ? 'animate-pulse' : ''}`} />
          {isAddingToCart ? 'Adding...' : isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart`}
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={handleWishlist}
            className={`flex items-center justify-center px-4 py-4 border-2 rounded-xl transition-all duration-300 group ${
              isWishlisted 
                ? 'border-red-200 bg-red-50 text-red-600' 
                : 'border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : 'group-hover:fill-current'} transition-all`} />
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-300 group"
          >
            <Share className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Estimated delivery:</span>
          <span className="font-semibold text-gray-900">2-5 business days</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Return window:</span>
          <span className="font-semibold text-gray-900">30 days</span>
        </div>
      </div>
    </div>
  );
}