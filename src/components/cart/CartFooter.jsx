// src/components/CartFooter.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners';

const CartFooter = ({
  hasMore,
  isLoading,
  onLoadMore,
  selectedTotal,
  isAllSelected,
  onToggleSelectAll,
  isCheckoutDisabled,
  onCheckout,
  pendingUpdates,
  loadingDeletes,
}) => (
  <div className="space-y-4">
    {hasMore && (
      <div className="text-center">
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="text-blue-600 hover:text-blue-800"
        >
          {isLoading ? 'Đang tải...' : 'Xem thêm'}
        </button>
      </div>
    )}

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-4 rounded-lg gap-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggleSelectAll}
        />
        <span>Chọn tất cả</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <div className="text-center sm:text-left">
          <div className="text-sm text-gray-600">Tổng thanh toán:</div>
          <div className="text-xl font-semibold text-primary">{selectedTotal} đ</div>
        </div>

        <button
          onClick={onCheckout}
          disabled={isCheckoutDisabled}
          className={`px-6 py-2 rounded text-white ${
            isCheckoutDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-main'
          }`}
        >
          {(pendingUpdates.size > 0 || loadingDeletes.size > 0) ? (
            <div className="flex items-center space-x-2">
              <ClipLoader size={16} color="#fff" />
              <span>Đang xử lý...</span>
            </div>
          ) : 'Thanh toán'}
        </button>
      </div>
    </div>

    <div className="text-sm text-gray-500 text-center">
      * Một số sản phẩm có thể không hiển thị do đã hết hàng hoặc đã ngừng kinh doanh.
    </div>
  </div>
);

export default CartFooter;
