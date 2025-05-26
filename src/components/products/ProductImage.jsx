import React from 'react'
import product_default from "@/assets/product_default.png"

const ProductImages = ({ imageUrl, isLoading }) => {
  if (isLoading) return <ProductImageSkeleton />
  return (
    <div className="w-[450px] px-2">
      <img
        src={imageUrl || product_default}
        alt="product"
        className="object-cover w-full h-full"
      />
    </div>
  )
}

export default ProductImages