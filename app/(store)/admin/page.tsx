import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isUserAdmin } from '@/lib/admin'
import { sanityFetch } from '@/sanity/lib/live'
import { groq } from 'next-sanity'
import { Package, DollarSign, ShoppingCart, TrendingUp, Users, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

// GROQ queries for analytics
const ORDERS_QUERY = groq`
  *[_type == "order"] {
    _id,
    _createdAt,
    total,
    currency,
    status,
    orderNumber,
    customerName,
    customerEmail,
    products[] {
      product-> {
        _id,
        name,
        price,
        image
      },
      quantity
    }
  } | order(_createdAt desc)
`

const PRODUCTS_QUERY = groq`
  *[_type == "product"] {
    _id,
    name,
    price,
    stock,
    image,
    categories[]-> {
      title
    }
  }
`

export default async function AdminDashboard() {
  // Check admin access
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in?redirect_url=/admin')
  }

  const isAdmin = await isUserAdmin(user)
  
  if (!isAdmin) {
    redirect('/?error=unauthorized')
  }

  // Fetch data
  const { data: orders } = await sanityFetch({
    query: ORDERS_QUERY,
  })

  const { data: products } = await sanityFetch({
    query: PRODUCTS_QUERY,
  })

  // Calculate analytics
  const totalOrders = orders?.length || 0
  const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0
  const totalProducts = products?.length || 0

  // Calculate product sales
  const productSales = new Map()
  const productRevenue = new Map()

  orders?.forEach((order: any) => {
    order.products?.forEach((item: any) => {
      const productId = item.product?._id
      const productName = item.product?.name
      const quantity = item.quantity || 0
      const price = item.product?.price || 0
      const revenue = quantity * price

      if (productId && productName) {
        productSales.set(productId, {
          name: productName,
          image: item.product?.image,
          totalSold: (productSales.get(productId)?.totalSold || 0) + quantity,
          totalRevenue: (productSales.get(productId)?.totalRevenue || 0) + revenue,
        })
      }
    })
  })

  // Convert to sorted arrays
  const topSellingProducts = Array.from(productSales.values())
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 10)

  const topRevenueProducts = Array.from(productSales.values())
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)

  // Recent orders
  const recentOrders = orders?.slice(0, 10) || []

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-purple-600">{totalProducts}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-orange-600">
                  ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Selling Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Top Selling Products
            </h2>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Revenue: ${product.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{product.totalSold}</p>
                    <p className="text-xs text-gray-500">units sold</p>
                  </div>
                </div>
              ))}
              {topSellingProducts.length === 0 && (
                <p className="text-gray-500 text-center py-8">No sales data available</p>
              )}
            </div>
          </div>

          {/* Top Revenue Products */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Top Revenue Products
            </h2>
            <div className="space-y-4">
              {topRevenueProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Units: {product.totalSold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${product.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
              {topRevenueProducts.length === 0 && (
                <p className="text-gray-500 text-center py-8">No sales data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-purple-600" />
            Recent Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Order #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Products</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm">{order.orderNumber || order._id.slice(-6)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{order.customerName || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {order.products?.slice(0, 3).map((item: any, idx: number) => (
                          <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {item.product?.name} x{item.quantity}
                          </span>
                        ))}
                        {order.products?.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{order.products.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-green-600">
                        ${order.total?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {new Date(order._createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status || 'completed'}
                      </span>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/studio"
              className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Eye className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Manage Content</span>
            </a>
            <a
              href="/admin/products"
              className="flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Package className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-purple-800 font-medium">Manage Products</span>
            </a>
            <a
              href="/admin/orders"
              className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">View All Orders</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}