import React from 'react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { QuantitySelector } from '@/components';
import product_default from '@/assets/product_default.png';
import icons from '@/utils/icons';

const { IoTrashBinOutline } = icons;

const CartItem = ({
  item,
  isSelected,
  onToggleSelect,
  onQuantityChange,
  onIncrease,
  onDecrease,
  onRemove,
  isCheckoutDisabled,
  loadingDeletes,
  pendingUpdates
}) => {
  const isItemDeleting = loadingDeletes.has(item.id);
  const hasAnyPendingUpdates = pendingUpdates.size > 0;
  const isDeleteDisabled = isItemDeleting || hasAnyPendingUpdates;

  const isOutOfStock = item.stock <= 0;
  const isInactive = item.isActive === false;
  const isUnavailable = isOutOfStock || isInactive;

  return (
    <div className='grid grid-cols-10 items-center border-b pb-4'>
      <div className={`ml-4 ${isUnavailable ? 'opacity-50' : ''}`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            if (!isUnavailable && item.stock >= item.quantity) {
              onToggleSelect(item.id);
            }
          }}
          disabled={isDeleteDisabled || isUnavailable}
        />
      </div>
      <Link
        to={`/products/${encodeURIComponent(item?.category)}/${item?.id}`}
        className={`col-span-6 flex items-center ${isUnavailable ? 'opacity-50' : ''}`}
      >
        <img
          src={item?.imageUrl || product_default}
          alt={item.productName}
          className="w-20 h-20 object-cover rounded-md mr-4"
        />
        <div className="flex flex-col">
          <h3 className="text-lg truncate hover:underline">{item.productName}</h3>
          <p className="text-sm text-gray-500">{item.price.toLocaleString('vi-VN')} đ</p>
          <p className="text-xs text-gray-500">Có sẵn: {item.stock}</p>
          {item.stock <= 0 && item.isActive && (
            <p className="text-red-500 text-xs">Sản phẩm tạm hết hàng</p>
          )}
          {item.stock < item.quantity && item.stock > 0 && (
            <p className="text-red-500 text-xs">Số lượng tồn kho không đủ</p>
          )}
          {isInactive && (
            <p className="text-red-500 text-xs font-semibold">Sản phẩm đã ngừng kinh doanh</p>
          )}
        </div>
      </Link>
      <div className={`${isUnavailable ? 'opacity-50' : ''} col-span-2 flex justify-center`}>
        <QuantitySelector
          quantity={item.quantity}
          stock={item.stock}
          onIncrease={!isUnavailable && !isDeleteDisabled ? () => onIncrease(item.id) : null}
          onDecrease={!isUnavailable && !isDeleteDisabled ? () => onDecrease(item.id) : null}
          onChange={!isUnavailable && !isDeleteDisabled ? (newQuantity) => onQuantityChange(item.id, newQuantity) : null}
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <button
          disabled={isDeleteDisabled}
          onClick={() => !isDeleteDisabled && onRemove(item.id)}
          className="w-8 h-8 flex items-center justify-center relative"
        >
          {isDeleteDisabled ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <ClipLoader size={20} color="#FF0000" loading={true} />
            </div>
          ) : (
            <IoTrashBinOutline
              className={`transition-transform duration-200 hover:scale-110 ${isUnavailable ? 'opacity-100' : ''}`}
              color="red"
              size={20}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
