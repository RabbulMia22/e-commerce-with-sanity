"use client"
import React, { useState, useEffect, useCallback } from 'react'
import {Product} from "@/sanity.types"
import ProductGrid from './ProductGrid';
import Categories from './Catagories';

interface ProductViewProps {
  products: Product[];
}

function ProductView({products}: ProductViewProps) {
  // State to store all product data
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize state with products from props
  useEffect(() => {
    if (products && products.length > 0) {
      setAllProducts(products);
      setFilteredProducts(products);
      setLoading(false);
    }
  }, [products]);

  // Memoized function to handle product filtering
  const handleFilterProducts = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered);
  }, []);

  // Memoized function to reset filters
  const resetFilters = useCallback(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
   <div className='flex flex-col lg:flex-row gap-4 lg:gap-8'>
    {/* category filter */}
    <div className='w-full lg:w-64 flex-shrink-0'>
      <div className='bg-white rounded-lg shadow-sm p-4 lg:sticky lg:top-20'>
        {/* Add your category filter UI here */}
        <div className="flex items-center justify-between mb-4">
          <h3 className='text-lg font-semibold'>Categories</h3>
          <span className="text-sm text-gray-500">
            ({filteredProducts.length}/{allProducts.length})
          </span>
        </div>
        <Categories 
          products={allProducts} 
          onFilterChange={handleFilterProducts}
          onResetFilters={resetFilters}
        />
      </div>
    </div>
    
    {/* Products grid */}
    <div className='flex-1 min-w-0'>
      <div className='bg-white rounded-lg shadow-sm'>
        <ProductGrid products={filteredProducts} />
      </div>
      <hr className='w-1/2 sm:w-3/4 mx-auto mt-8 border-gray-200'/>
    </div>
   </div>
  )
}

export default ProductView