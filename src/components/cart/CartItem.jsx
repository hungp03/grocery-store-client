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
  const hasAnyPending = pendingUpdates.size > 0;
  const disabled = isItemDeleting || hasAnyPending;
  const unavailable = item.stock <= 0 || item.isActive === false;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center border-b pb-4 gap-4">
      {/* Checkbox */}
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          disabled={disabled || unavailable}
          onChange={() => !unavailable && onToggleSelect(item.id)}
          className={`${unavailable ? 'opacity-50' : ''}`}
        />
      </div>

      {/* Image & Info */}
      <Link
        to={`/products/${encodeURIComponent(item.category)}/${item.id}`}
        className={`flex-grow flex items-center gap-4 ${
          unavailable ? 'opacity-50' : ''
        }`}
      >
        <img
          src={item.imageUrl || product_default}
          alt={item.productName}
          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="text-base truncate hover:underline">{item.productName}</h3>
          <p className="text-sm text-gray-500">{item.price.toLocaleString('vi-VN')} đ</p>
          <p className="text-xs text-gray-500">Có sẵn: {item.stock}</p>
          {item.stock <= 0 && item.isActive && (
            <p className="text-red-500 text-xs">Hết hàng</p>
          )}
          {item.stock < item.quantity && item.stock > 0 && (
            <p className="text-red-500 text-xs">Không đủ tồn kho</p>
          )}
          {!item.isActive && (
            <p className="text-red-500 text-xs font-semibold">Ngừng kinh doanh</p>
          )}
        </div>
      </Link>

      {/* Quantity Selector */}
      <div className="flex-shrink-0">
        <QuantitySelector
          quantity={item.quantity}
          stock={item.stock}
          onIncrease={!unavailable && !disabled ? () => onIncrease(item.id) : null}
          onDecrease={!unavailable && !disabled ? () => onDecrease(item.id) : null}
          onChange={!unavailable && !disabled ? q => onQuantityChange(item.id, q) : null}
        />
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <button
          disabled={disabled}
          onClick={() => !disabled && onRemove(item.id)}
          className="p-2 relative"
        >
          {disabled ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <ClipLoader size={20} color="#ff0000" loading />
            </div>
          ) : (
            <IoTrashBinOutline size={20} color="red" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CartItem;