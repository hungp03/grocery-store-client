// src/components/EmptyCart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import path from '@/utils/path';

const EmptyCart = () => (
  <div className="flex flex-col items-center py-10 space-y-4">
    <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
    <Link to={`/${path.PRODUCTS_BASE}`}>
      <button className="bg-main px-6 py-3 rounded text-white hover:bg-green-500">
        Mua sắm ngay
      </button>
    </Link>
  </div>
);

export default EmptyCart;
