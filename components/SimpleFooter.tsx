import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function SimpleFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay Connected with Bangladesh's Best E-Commerce 🇧🇩
            </h3>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto">
              Get exclusive deals, new arrivals, and special offers delivered straight to your inbox. 
              Join thousands of happy customers across Bangladesh!
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-green-300 focus:outline-none"
              />
              <button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-300 hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                BanglaBazar
              </h3>
              <p className="text-gray-400 mt-4 leading-relaxed">
                Your trusted online shopping destination in Bangladesh. We deliver quality products 
                to all 64 districts with love and care. 🛍️
              </p>
            </div>
            
            {/* Social Media Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="group">
                  <div className="bg-gray-800 hover:bg-blue-600 p-3 rounded-full transition-all duration-300 transform group-hover:scale-110">
                    <Facebook className="w-5 h-5" />
                  </div>
                </Link>
                <Link href="#" className="group">
                  <div className="bg-gray-800 hover:bg-blue-400 p-3 rounded-full transition-all duration-300 transform group-hover:scale-110">
                    <Twitter className="w-5 h-5" />
                  </div>
                </Link>
                <Link href="#" className="group">
                  <div className="bg-gray-800 hover:bg-pink-600 p-3 rounded-full transition-all duration-300 transform group-hover:scale-110">
                    <Instagram className="w-5 h-5" />
                  </div>
                </Link>
                <Link href="#" className="group">
                  <div className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-all duration-300 transform group-hover:scale-110">
                    <Youtube className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Products', href: '/products' },
                { name: 'Categories', href: '/categories' },
                { name: 'My Orders', href: '/myOrder' },
                { name: 'Shopping Cart', href: '/basket' },
                { name: 'Wishlist', href: '/wishlist' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'FAQ', href: '/faq' },
                { name: 'Shipping Info', href: '/shipping' },
                { name: 'Return Policy', href: '/returns' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'Track Order', href: '/track' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-500 transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-400 leading-relaxed">
                    Dhaka, Bangladesh<br />
                    Serving all 64 districts
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-500 transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-400">+880 1XXX-XXXXXX</p>
                  <p className="text-sm text-gray-500">Mon-Sat, 9AM-9PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-500 transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-400">support@banglabazar.com</p>
                  <p className="text-sm text-gray-500">24/7 Email Support</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8">
              <h5 className="font-semibold mb-4">We Accept</h5>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-800 px-3 py-2 rounded-lg text-sm">💳 Visa</div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg text-sm">💳 Mastercard</div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg text-sm">📱 bKash</div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg text-sm">📱 Nagad</div>
                <div className="bg-gray-800 px-3 py-2 rounded-lg text-sm">💰 Cash</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bangladesh Districts Showcase */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <h4 className="text-lg font-semibold mb-6 text-center">
            🇧🇩 We Deliver Across Bangladesh - All 64 Districts
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-sm text-gray-400">
            {[
              'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
              'Comilla', 'Gazipur', 'Narayanganj', 'Jessore', 'Bogra', 'Dinajpur', 'Pabna', 'Kushtia',
            ].map((district) => (
              <div key={district} className="text-center hover:text-green-400 transition-colors duration-300 cursor-pointer">
                {district}
              </div>
            ))}
            <div className="text-center text-green-400 font-medium col-span-2 sm:col-span-4 lg:col-span-8 mt-2">
              + 48 More Districts
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>&copy; 2025 BanglaBazar. All rights reserved.</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Made in Bangladesh</span>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* Fun Bangladesh Element */}
          <div className="text-center mt-4 text-gray-500 text-sm">
            <p className="flex items-center justify-center space-x-2">
              <span>🌾</span>
              <span>Proudly serving the land of golden Bengal</span>
              <span>🌾</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}