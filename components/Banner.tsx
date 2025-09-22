import { COUPON_CODE } from '@/sanity/lib/sales/coupponCode';
import { getCouponCode } from '@/sanity/lib/sales/getCouponCode';
import React from 'react'

async function Banner() {
  const sale = await getCouponCode(COUPON_CODE.SSUNDAY);

  if (!sale?.isActive) {
      return null;
  }
 console.log("Banner component rendered", sale.description);
 

  return (
    <div className='relative bg-gradient-to-r from-red-600 to-black text-white px-6 py-10 mx-4 mt-2 rounded-lg shadow-lg overflow-hidden'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 relative z-10'>
        {/* Left side - Sale info */}
        <div className='flex-1 text-center md:text-left'>
          <h2 className='text-2xl md:text-3xl font-bold mb-2'>{sale.title}</h2>
          <p className='text-sm md:text-base opacity-90 mb-4'>{sale.description}</p>
          
          {/* Discount badge */}
          {sale.discountAmount && (
            <div className='inline-flex items-center bg-white text-red-600 px-4 py-2 rounded-full font-bold text-lg shadow-md'>
              <span className='text-2xl mr-1'>🔥</span>
              {sale.discountAmount}% OFF
            </div>
          )}
        </div>

        {/* Right side - Coupon code */}
        <div className='flex flex-col items-center space-y-3'>
          <div className='bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-lg p-4 text-center'>
            <p className='text-xs uppercase tracking-wide opacity-80 mb-1'>Use Code</p>
            <div className='bg-white text-red-600 px-4 py-2 rounded font-mono text-lg font-bold tracking-wider'>
              {sale.couponCode}
            </div>
          </div>
          
          {/* Valid until */}
          {sale.validUntil && (
            <p className='text-xs opacity-75'>
              Valid until: {new Date(sale.validUntil).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12'></div>
    </div>
  )
}

export default Banner