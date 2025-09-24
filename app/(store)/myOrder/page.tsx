"use client"

import React, { useState } from 'react'
import { Package, Clock, Truck, CheckCircle, Search, Filter, Eye, RotateCcw } from 'lucide-react'
import { imageUrl } from '@/sanity/lib/imageUrl'
import Image from 'next/image'
import { useHydratedStore } from '@/hooks/useHydratedStore'

function MyOrderPage() {
  const { getOrders, addToBasket, hydrated, cleanupDuplicateOrders } = useHydratedStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Cleanup duplicates when component mounts
  React.useEffect(() => {
    if (hydrated) {
      cleanupDuplicateOrders();
    }
  }, [hydrated, cleanupDuplicateOrders]);

  // Show loading state while store is hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 border">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-6 animate-pulse" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Orders...</h1>
              <p className="text-gray-600">Please wait while we load your order history.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allOrders = getOrders();
  
  // Filter to only show orders with valid sessionId (completed payments)
  const completedOrders = allOrders.filter(order => 
    order.sessionId && order.sessionId.length > 0
  );

  // Filter orders based on search and status
  const filteredOrders = completedOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.product.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleReorder = (orderItems: any[]) => {
    orderItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        addToBasket(item.product);
      }
    });
    alert('Items added to basket!');
  };

  if (completedOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 border">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
              <p className="text-gray-600 mb-8">
                You haven't completed any payments yet. Complete a purchase to see your orders here!
              </p>
              <a
                href="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Orders</h1>
          <p className="text-xl text-gray-600">Track your completed purchases ({completedOrders.length} orders)</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, orderIndex) => (
            <div key={`${order.id}-${orderIndex}`} className="bg-white rounded-2xl shadow-xl border overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-green-600 font-semibold">✓ Payment Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="grid gap-4">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-item-${index}-${item.product._id}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        {item.product.image ? (
                          <Image
                            src={imageUrl(item.product.image).width(80).height(80).url()}
                            alt={item.product.title || 'Product'}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {item.product.title || 'Product'}
                        </h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">Price: ${item.product.price?.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
                          ${((item.product.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => handleReorder(order.items)}
                    className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reorder
                  </button>
                  <button className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                    <Eye className="w-5 h-5 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && completedOrders.length > 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-xl p-12 border">
              <Search className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h2>
              <p className="text-gray-600">
                Try adjusting your search terms or filter criteria.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrderPage;