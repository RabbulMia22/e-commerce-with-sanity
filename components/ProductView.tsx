import React from 'react'
import {Product} from "@/sanity.types"
import ProductGrid from './ProductGrid';


interface ProductViewProps {
  products: Product[];
}



function ProductView({products}: ProductViewProps) {
  return (
   <div className='flex flex-col'>
    {/* category filter */}
    <div className='w-full sm:w-[200px]'>
      {/* Add your category filter UI here */}
    </div>
    <div className='flex-1 items-center justify-center'>
      <div className=''>
        <ProductGrid products={products} />
        <hr className='w-1/2 sm:w-3/4'/>
      </div>
    </div>

   </div>
  )
}

export default ProductView