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
      image?: any
    }
    quantity: number
  }>
}

interface AdminOrderActionsProps {
  order: Order
  onOrderDeleted: (orderId: string) => void
}

export default function AdminOrderActions({ order, onOrderDeleted }: AdminOrderActionsProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/admin/orders/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: order._id })
      })

      if (response.ok) {
        onOrderDeleted(order._id)
        setShowDeleteConfirm(false)
      } else {
        console.error('Failed to delete order')
        alert('Failed to delete order. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Error deleting order. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatPrice = (price?: number) => {
    return price ? `$${price.toFixed(2)}` : '$0.00'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div className="flex space-x-2">
        {/* Details Button */}
        <button
          onClick={() => setShowDetails(true)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Order"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Order Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={() => setShowDetails(false)}
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
                    <p><span className="font-medium">Order #:</span> {order.orderNumber || order._id.slice(-8)}</p>
                    <p><span className="font-medium">Total:</span> {formatPrice(order.totalPrice || order.total)}</p>
                    <p><span className="font-medium">Currency:</span> {order.currency || 'USD'}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(order.deliveryStatus)}`}>
                        {order.deliveryStatus || 'confirmed'}
                      </span>
                    </p>
                    <p><span className="font-medium">Date:</span> {formatDate(order._createdAt)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {order.customerName || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {order.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">🇧🇩 {order.shippingAddress.fullName}</p>
                    <p className="text-blue-600 font-medium">📞 {order.shippingAddress.phoneNumber}</p>
                    <p className="text-green-600 font-medium">📍 {order.shippingAddress.district} District</p>
                    <p className="text-gray-600 mt-1">{order.shippingAddress.homeAddress}</p>
                    <p className="text-gray-500">{order.shippingAddress.country || 'Bangladesh'}</p>
                  </div>
                </div>
              )}

              {/* Products */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ordered Products</h3>
                <div className="space-y-4">
                  {order.products?.map((item, index) => (
                    <div key={`${order._id}-product-${index}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
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
                        <p className="text-sm text-gray-600">Price: {formatPrice(item.product?.price)}</p>
                      </div>

                      {/* Total */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Notes */}
              {order.deliveryNotes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Delivery Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-800">{order.deliveryNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Order</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete order #{order.orderNumber || order._id.slice(-8)}? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}