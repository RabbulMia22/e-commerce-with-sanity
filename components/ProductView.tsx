import React from 'react'
import {Product} from "@/sanity.types"
import ProductGrid from './ProductGrid';


interface ProductViewProps {
  products: Product[];
}



function ProductView({products}: ProductViewProps) {
  return (
   <div className='flex flex-col lg:flex-row gap-4 lg:gap-8'>
    {/* category filter */}
    <div className='w-full lg:w-64 flex-shrink-0'>
      <div className='bg-white rounded-lg shadow-sm p-4 lg:sticky lg:top-20'>
        {/* Add your category filter UI here */}
        <h3 className='text-lg font-semibold mb-4'>Categories</h3>
        <p className='text-gray-500 text-sm'>Filter options coming soon...</p>
      </div>
    </div>
    
    {/* Products grid */}
    <div className='flex-1 min-w-0'>
      <div className='bg-white rounded-lg shadow-sm'>
        <ProductGrid products={products} />
      </div>
      <hr className='w-1/2 sm:w-3/4 mx-auto mt-8 border-gray-200'/>
    </div>
   </div>
  )
}

export default ProductView