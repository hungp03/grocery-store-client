import React from 'react'

const ProductInfoSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-4 h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-4 h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="mt-8 h-10 bg-gray-200 rounded"></div>
        </div>
    )
}

export default ProductInfoSkeleton