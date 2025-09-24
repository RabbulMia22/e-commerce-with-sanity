'use client'

import { useState } from 'react'
import { Trash2, FileText, X, Package } from 'lucide-react'
import { imageUrl } from '@/sanity/lib/imageUrl'

interface Order {
  _id: string
  orderNumber?: string
  customerName?: string
  email?: string
  totalPrice?: number
  total?: number
  currency?: string
  status?: string
  deliveryStatus?: string
  deliveryNotes?: string
  _createdAt: string
  shippingAddress?: {
    fullName: string
    phoneNumber: string
    district: string
    homeAddress: string
    country: string
  }
  products?: Array<{
    product: {
      _id: string
      name: string
      price: number
      image?: {
        asset: {
          _ref: string
        }
      }
    }
    quantity: number
  }>
}

interface AdminDashboardClientProps {
  orders: Order[]
  products: unknown[]
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  topSellingProducts: unknown[]
  topRevenueProducts: unknown[]
}

export default function AdminDashboardClient({
  orders
}: AdminDashboardClientProps) {
  const [ordersState, setOrdersState] = useState(orders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const recentOrders = ordersState?.slice(0, 10) || []

  const handleOrderDeleted = (orderId: string) => {
    setOrdersState(ordersState.filter((order: Order) => order._id !== orderId))
  }

  return (
    <>
      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Order #</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Shipping Address</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Products</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Delivery Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order: Order) => (
                <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm">{order.orderNumber || order._id.slice(-6)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium">{order.customerName || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.email || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {order.shippingAddress ? (
                      <div className="text-sm">
                        <p className="font-medium">🇧🇩 {order.shippingAddress.fullName}</p>
                        <p className="text-blue-600 text-xs font-medium">📞 {order.shippingAddress.phoneNumber}</p>
                        <p className="text-green-600 font-medium">📍 {order.shippingAddress.district.charAt(0).toUpperCase() + order.shippingAddress.district.slice(1)} District</p>
                        <p className="text-gray-600 text-xs mt-1">{order.shippingAddress.homeAddress}</p>
                        <p className="text-gray-500 text-xs">🌏 Bangladesh</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No shipping address</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-2">
                      {order.products?.slice(0, 2).map((item, idx: number) => (
                        <div key={`${order._id}-product-${idx}`} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                          {/* Product Image */}
                          <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                            {item.product?.image ? (
                              <img
                                src={imageUrl(item.product.image).width(40).height(40).url()}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* Product Info */}
                          <div className="text-xs">
                            <p className="font-medium text-gray-800 truncate max-w-20" title={item.product?.name}>
                              {item.product?.name}
                            </p>
                            <p className="text-gray-600">×{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.products && order.products.length > 2 && (
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded text-xs font-medium text-gray-600">
                          +{order.products.length - 2}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-green-600">
                      ${(order.totalPrice || order.total)?.toFixed(2) || '0.00'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.deliveryStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.deliveryStatus === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
                      order.deliveryStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.deliveryStatus || 'confirmed'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {new Date(order._createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      {/* Details Button */}
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowOrderDetails(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete order #${order.orderNumber || order._id.slice(-8)}? This action cannot be undone.`)) {
                            try {
                              const response = await fetch('/api/admin/orders/delete', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ orderId: order._id })
                              })
                              
                              if (response.ok) {
                                handleOrderDeleted(order._id)
                                alert('Order deleted successfully')
                              } else {
                                alert('Failed to delete order')
                              }
                            } catch {
                              alert('Error deleting order')
                            }
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => {
                  setShowOrderDetails(false)
                  setSelectedOrder(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Order #:</span> {selectedOrder.orderNumber || selectedOrder._id.slice(-8)}</p>
                    <p><span className="font-medium">Total:</span> ${(selectedOrder.totalPrice || selectedOrder.total)?.toFixed(2) || '0.00'}</p>
                    <p><span className="font-medium">Currency:</span> {selectedOrder.currency || 'USD'}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedOrder.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                        selectedOrder.deliveryStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.deliveryStatus === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
                        selectedOrder.deliveryStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOrder.deliveryStatus || 'confirmed'}
                      </span>
                    </p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder._createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customerName || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">🇧🇩 {selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-blue-600 font-medium">📞 {selectedOrder.shippingAddress.phoneNumber}</p>
                    <p className="text-green-600 font-medium">📍 {selectedOrder.shippingAddress.district} District</p>
                    <p className="text-gray-600 mt-1">{selectedOrder.shippingAddress.homeAddress}</p>
                    <p className="text-gray-500">{selectedOrder.shippingAddress.country || 'Bangladesh'}</p>
                  </div>
                </div>
              )}

              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ordered Products</h3>
                <div className="space-y-4">
                  {selectedOrder.products?.map((item, index) => (
                    <div key={`${selectedOrder._id}-detail-product-${index}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product?.image ? (
                          <img
                            src={imageUrl(item.product.image).width(64).height(64).url()}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ${item.product?.price?.toFixed(2) || '0.00'}</p>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Notes */}
              {selectedOrder.deliveryNotes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Delivery Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-800">{selectedOrder.deliveryNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}