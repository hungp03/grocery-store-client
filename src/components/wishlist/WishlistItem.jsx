import React from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import icons from '@/utils/icons';
import product_default from '@/assets/product_default.png';

const { IoTrashBinOutline } = icons;

const WishlistItem = ({ item, loadingDeletes, removeItem }) => {
  const isInactive = item.active === false;

  return (
    <div key={item.id} className='relative flex bg-white p-4 items-center justify-between border-b rounded-md overflow-hidden'>
      <Link
        to={`/products/${encodeURIComponent(item.category)}/${item.id}`}
        className={`flex items-center flex-1 ${isInactive ? 'opacity-60' : ''}`}
      >
        <img
          className='w-20 h-20 object-cover rounded-md mr-4'
          src={item?.imageUrl || product_default}
          alt={item.productName}
        />
        <div className="flex flex-col">
          <h3 className="truncate hover:underline">{item.productName}</h3>
          {isInactive && <p className={'text-sm text-red-500'}>
            Sản phẩm đã ngừng kinh doanh
          </p>}
        </div>
      </Link>

      <div className='flex justify-center w-32'>
        <p className="text-sm text-gray-500">{item.price.toLocaleString('vi-VN')} đ</p>
      </div>

      <div className="flex justify-center w-20" title='Xóa sản phẩm'>
        <button
          disabled={loadingDeletes.has(item.id)}
          onClick={() => removeItem(item.id)}
          className={`transition-transform duration-200 hover:cursor-pointer hover:scale-110 ${
            loadingDeletes.has(item.id) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loadingDeletes.has(item.id) ? (
            <ClipLoader size={20} color="#FF0000" />
          ) : (
            <IoTrashBinOutline color="red" size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default WishlistItem;
