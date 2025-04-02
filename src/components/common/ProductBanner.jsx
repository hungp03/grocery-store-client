import React from 'react'

const ProductBanner = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-1 mt-10">
      <img
        src="https://free.vector6.com/wp-content/uploads/2020/04/0425-Vector-Hoa-Qua-ourckq010.jpg"
        alt=""
        className="w-full h-full col-span-3 row-span-1 "
      />
      <img
        className="w-full h-full col-span-2 row-span-1"
        src="https://free.vector6.com/wp-content/uploads/2020/04/0425-Vector-Hoa-Qua-ourckq031.jpg"
        alt=""
      />
    </div>
  )
}

export default ProductBanner