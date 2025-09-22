"use client"
import { Product } from '@/sanity.types';
import React from 'react'
import ProductThumbnail from './ProductThumbnail';
import { AnimatePresence, motion } from 'framer-motion';

function ProductGrid({products}: {products: Product[]}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 place-items-center">
  {products.map((product) => (
    <AnimatePresence key={product._id}>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center"
      >
        <ProductThumbnail product={product} />
      </motion.div>
    </AnimatePresence>
  ))}
</div>
  )
}

export default ProductGrid;