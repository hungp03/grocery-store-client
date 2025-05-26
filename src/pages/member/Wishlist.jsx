import React, { useEffect, useState, useRef } from 'react';
import { Pagination, WishlistItem } from '@/components';
import { apiDeleteWishlist, apiGetWishlist } from '@/apis';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { RESPONSE_STATUS } from "@/utils/responseStatus";
import { PulseLoader } from 'react-spinners';

const PAGE_SIZE = 5;
const DELETE_DELAY = 500;

const Wishlist = () => {
  const { current, isLoggedIn } = useSelector(state => state.user);
  const [wishlist, setWishlist] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingDeletes, setLoadingDeletes] = useState(new Set());
  const debounceTimeouts = useRef({});

  const fetchWishlistItems = async (page = 1) => {
    setLoading(true);
    const response = await apiGetWishlist(page, PAGE_SIZE);
    if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
      setWishlist(response?.data);
    } else {
      message.error("Có lỗi xảy ra khi tải dữ liệu");
    }
    setLoading(false);
  };

  const deleteProductInWishlist = async (pid) => {
    const res = await apiDeleteWishlist(pid);
    if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
      message.success("Đã xóa sản phẩm khỏi yêu thích");
    } else {
      message.error("Có lỗi trong quá trình xóa");
    }
  };

  const removeItem = (pid) => {
    setLoadingDeletes(prev => new Set(prev).add(pid));
    debounceTimeouts.current[pid] = setTimeout(() => {
      setWishlist(prev => ({
        ...prev,
        result: prev?.result?.filter(item => item.id !== pid),
      }));

      deleteProductInWishlist(pid).finally(() => {
        setLoadingDeletes(prev => {
          const updated = new Set(prev);
          updated.delete(pid);
          return updated;
        });
      });
    }, DELETE_DELAY);
  };

  useEffect(() => {
    if (isLoggedIn && current) {
      fetchWishlistItems(page);
    }
    return () => {
      Object.values(debounceTimeouts.current).forEach(clearTimeout);
    };
  }, [isLoggedIn, current, page]);

  return (
    <div className="w-full px-4">
      <header className="text-xl font-semibold py-4 mb-5 border-b text-center md:text-left">
        Danh sách yêu thích
      </header>
      <div className="max-w-6xl mx-auto py-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <PulseLoader color="#36d7b7" size={15} />
          </div>
        ) : wishlist?.result?.length > 0 ? (
          wishlist.result.map(item => (
            <WishlistItem
              key={item.id}
              item={item}
              loadingDeletes={loadingDeletes}
              removeItem={removeItem}
            />
          ))
        ) : (
          <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
            Wishlist của bạn đang trống.
          </div>
        )}
      </div>

      {wishlist?.meta?.pages > 1 && (
        <div className="flex justify-center my-6">
          <Pagination
            totalPage={wishlist.meta.pages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Wishlist;
