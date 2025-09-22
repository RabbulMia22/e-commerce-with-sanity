"use client"
import { Product } from '@/sanity.types';
import React from 'react'
import ProductThumbnail from './ProductThumbnail';
import { AnimatePresence, motion } from 'framer-motion';

function ProductGrid({products}: {products: Product[]}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 auto-rows-fr">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.05,
          }}
          className="w-full h-full flex"
        >
          <ProductThumbnail product={product} />
        </motion.div>
      ))}
    </div>
  )
}

export default ProductGrid;