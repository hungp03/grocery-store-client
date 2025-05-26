import React from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import icons from '@/utils/icons';
import product_default from '@/assets/product_default.png';

const { IoTrashBinOutline } = icons;

const WishlistItem = ({ item, loadingDeletes, removeItem }) => {
  const isInactive = item.active === false;
  const loading = loadingDeletes.has(item.id);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 border rounded-md shadow-sm gap-4 sm:gap-0">
      <Link
        to={`/products/${encodeURIComponent(item.category)}/${item.id}`}
        className={`flex items-center flex-1 w-full sm:w-auto ${isInactive ? 'opacity-60' : ''}`}
      >
        <img
          className="w-20 h-20 object-cover rounded-md mr-4"
          src={item?.imageUrl || product_default}
          alt={item.productName}
        />
        <div className="flex flex-col max-w-[200px]">
          <h3 className="hover:underline">{item.productName}</h3>
          {isInactive && <p className="text-sm text-red-500">Sản phẩm đã ngừng kinh doanh</p>}
        </div>
      </Link>

      <div className="text-sm text-gray-500 w-full sm:w-32 text-center">
        {item.price.toLocaleString('vi-VN')} đ
      </div>

      <button
        disabled={loading}
        onClick={() => removeItem(item.id)}
        title="Xóa sản phẩm"
        className={`transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? <ClipLoader size={20} color="#FF0000" /> : <IoTrashBinOutline color="red" size={20} />}
      </button>
    </div>
  );
};

export default WishlistItem;
