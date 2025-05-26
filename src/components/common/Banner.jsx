import React from 'react';
import { Link } from 'react-router-dom';
import path from '@/utils/path';

const Banner = () => (
  <div className="relative overflow-hidden rounded-lg">
    <div className="aspect-w-16 aspect-h-6 md:aspect-h-4">
      <img
        src="https://res.cloudinary.com/ahossain/image/upload/v1697688491/settings/slider-2_o6aezc.jpg"
        alt="banner"
        className="object-cover w-full h-full"
      />
    </div>
    <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12">
      <h1 className="text-2xl md:text-4xl font-semibold mb-2 text-black">
        Chào mừng bạn đến với Ogani
      </h1>
      <p className="text-main mb-4">Xem ngay những sản phẩm của chúng tôi</p>
      <Link
        to={`/${path.PRODUCTS_BASE}`}
        className="bg-main font-bold py-2 px-4 rounded text-gray-50"
      >
        Mua ngay
      </Link>
    </div>
  </div>
);

export default Banner;
