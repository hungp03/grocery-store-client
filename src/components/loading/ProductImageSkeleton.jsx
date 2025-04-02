import React from 'react'

const ProductSkeleton = () => (
    <div className="animate-pulse">
      <div className="w-[450px] h-[450px] bg-gray-200 rounded"></div>
      <div className="mt-4 h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-6 bg-gray-200 rounded w-1/2"></div>
      <div className="mt-4 h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  )
export default ProductSkeleton