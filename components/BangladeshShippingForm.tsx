"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, User } from 'lucide-react'

interface ShippingInfo {
  fullName: string
  phoneNumber: string
  district: string
  homeAddress: string
}

interface BangladeshShippingFormProps {
  onSubmit: (shippingInfo: ShippingInfo) => void
  loading?: boolean
}

const BANGLADESH_DISTRICTS = [
  { label: "Dhaka", value: "dhaka" },
  { label: "Chittagong", value: "chittagong" },
  { label: "Rajshahi", value: "rajshahi" },
  { label: "Khulna", value: "khulna" },
  { label: "Barisal", value: "barisal" },
  { label: "Sylhet", value: "sylhet" },
  { label: "Rangpur", value: "rangpur" },
  { label: "Mymensingh", value: "mymensingh" },
  { label: "Comilla", value: "comilla" },
  { label: "Narayanganj", value: "narayanganj" },
  { label: "Gazipur", value: "gazipur" },
  { label: "Jessore", value: "jessore" },
  { label: "Bogra", value: "bogra" },
  { label: "Dinajpur", value: "dinajpur" },
  { label: "Pabna", value: "pabna" },
  { label: "Tangail", value: "tangail" },
  { label: "Jamalpur", value: "jamalpur" },
  { label: "Kishoreganj", value: "kishoreganj" },
  { label: "Faridpur", value: "faridpur" },
  { label: "Manikganj", value: "manikganj" },
  { label: "Narsingdi", value: "narsingdi" },
  { label: "Brahmanbaria", value: "brahmanbaria" },
  { label: "Chandpur", value: "chandpur" },
  { label: "Lakshmipur", value: "lakshmipur" },
  { label: "Noakhali", value: "noakhali" },
  { label: "Feni", value: "feni" },
  { label: "Cox's Bazar", value: "coxsbazar" },
  { label: "Bandarban", value: "bandarban" },
  { label: "Rangamati", value: "rangamati" },
  { label: "Khagrachhari", value: "khagrachhari" },
  { label: "Patuakhali", value: "patuakhali" },
  { label: "Pirojpur", value: "pirojpur" },
  { label: "Jhalokati", value: "jhalokati" },
  { label: "Barguna", value: "barguna" },
  { label: "Bhola", value: "bhola" },
  { label: "Satkhira", value: "satkhira" },
  { label: "Bagerhat", value: "bagerhat" },
  { label: "Narail", value: "narail" },
  { label: "Chuadanga", value: "chuadanga" },
  { label: "Kushtia", value: "kushtia" },
  { label: "Meherpur", value: "meherpur" },
  { label: "Jhenaidah", value: "jhenaidah" },
  { label: "Magura", value: "magura" },
  { label: "Rajbari", value: "rajbari" },
  { label: "Gopalganj", value: "gopalganj" },
  { label: "Madaripur", value: "madaripur" },
  { label: "Shariatpur", value: "shariatpur" },
  { label: "Sirajganj", value: "sirajganj" },
  { label: "Natore", value: "natore" },
  { label: "Naogaon", value: "naogaon" },
  { label: "Joypurhat", value: "joypurhat" },
  { label: "Chapainawabganj", value: "chapainawabganj" },
  { label: "Gaibandha", value: "gaibandha" },
  { label: "Thakurgaon", value: "thakurgaon" },
  { label: "Panchagarh", value: "panchagarh" },
  { label: "Lalmonirhat", value: "lalmonirhat" },
  { label: "Nilphamari", value: "nilphamari" },
  { label: "Kurigram", value: "kurigram" },
  { label: "Netrokona", value: "netrokona" },
  { label: "Sherpur", value: "sherpur" },
  { label: "Moulvibazar", value: "moulvibazar" },
  { label: "Habiganj", value: "habiganj" },
  { label: "Sunamganj", value: "sunamganj" },
  { label: "Munshiganj", value: "munshiganj" },
]

export default function BangladeshShippingForm({ onSubmit, loading = false }: BangladeshShippingFormProps) {
  const [formData, setFormData] = useState<ShippingInfo>({
    fullName: '',
    phoneNumber: '',
    district: '',
    homeAddress: ''
  })

  const [errors, setErrors] = useState<Partial<ShippingInfo>>({})

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^(\+8801|01)[3-9]\d{8}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid Bangladesh phone number'
    }

    if (!formData.district) {
      newErrors.district = 'District selection is required'
    }

    if (!formData.homeAddress.trim()) {
      newErrors.homeAddress = 'Home address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🇧🇩 Shipping Information</h2>
        <p className="text-gray-600 text-sm">Delivery available across Bangladesh</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 mr-2" />
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* District Selection */}
        <div>
          <label htmlFor="district" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            District
          </label>
          <select
            id="district"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.district ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your district</option>
            {BANGLADESH_DISTRICTS.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-xs mt-1">{errors.district}</p>
          )}
        </div>

        {/* Home Address */}
        <div>
          <label htmlFor="homeAddress" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Home Address
          </label>
          <textarea
            id="homeAddress"
            rows={3}
            value={formData.homeAddress}
            onChange={(e) => handleInputChange('homeAddress', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.homeAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your detailed address (area, road, house number, landmark)"
          />
          {errors.homeAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.homeAddress}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Please provide detailed address within your selected district
          </p>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
        >
          {loading ? 'Processing...' : '🚚 Proceed to Payment'}
        </Button>
      </form>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <p className="text-green-700 text-sm font-medium">✅ Free delivery across Bangladesh!</p>
        <p className="text-green-600 text-xs mt-1">We deliver to all 64 districts</p>
      </div>
    </div>
  )
}