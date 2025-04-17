import React, { useEffect, useState, useRef } from 'react';
import { Pagination } from '@/components';
import { apiDeleteWishlist, apiGetWishlist } from '@/apis';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import { WishlistItem } from '@/components';
import { RESPONSE_STATUS } from "@/utils/responseStatus";
import { PulseLoader } from 'react-spinners';
const PAGE_SIZE = 5;
const DELETE_DELAY = 500;

const Wishlist = () => {
    const { current, isLoggedIn } = useSelector(state => state.user);
    const [wishlist, setWishlist] = useState(null);
    const [pages, setPages] = useState(1);
    const [loadingDeletes, setLoadingDeletes] = useState(new Set());
    const debounceTimeouts = useRef({});
    const [loading, setLoading] = useState(false);

    const handlePagination = (page = 1) => {
        setPages(page);
        fetchWishlistItems(page);
    };

    const deleteProductInWishlist = async (pid) => {
        const res = await apiDeleteWishlist(pid);
        if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
            message.success("Đã xóa sản phẩm khỏi yêu thích");
        } else {
            message.error("Có lỗi trong quá trình xóa");
        }
    };

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

    useEffect(() => {
        if (isLoggedIn && current) {
            fetchWishlistItems(pages);
        }
        return () => {
            Object.values(debounceTimeouts.current).forEach(timeout => clearTimeout(timeout));
        };
    }, [isLoggedIn, pages]);

    const removeItem = (pid) => {
        setLoadingDeletes(prev => new Set(prev).add(pid));
        debounceTimeouts.current[pid] = setTimeout(() => {
            setWishlist(prevWishlist => {
                if (!prevWishlist || !prevWishlist.result) return prevWishlist;
                const updatedResult = prevWishlist.result.filter(item => item.id !== pid);
                return { ...prevWishlist, result: updatedResult };
            });

            deleteProductInWishlist(pid).then(() => {
                setLoadingDeletes(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(pid);
                    return newSet;
                });
            }).catch(error => {
                console.error("Lỗi khi xóa sản phẩm:", error);
                message.error("Có lỗi xảy ra khi xóa sản phẩm");
            });
        }, DELETE_DELAY);
    };

    return (
        <div className='w-full relative px-4'>
            <header className="text-xl font-semibold py-4 mb-5 border-b">Wishlist</header>
            <div className="w-4/5 mx-auto py-8 flex flex-col gap-4">
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh] h-full">
                    <PulseLoader color="#36d7b7" loading={loading} size={20} />
                </div>
            ) : (
                wishlist?.result?.length > 0 ? (
                    <div className="space-y-2">
                        {wishlist?.result.map(item => (
                            <WishlistItem
                                key={item.id}
                                item={item}
                                loadingDeletes={loadingDeletes}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center min-h-[70vh]'>
                        <p className="text-gray-500">Wishlist của bạn đang trống.</p>
                    </div>
                )
            )}
            </div>
            {wishlist?.meta?.pages > 1 && (
                <div className='w-4/5 m-auto my-4 flex justify-center'>
                    <Pagination
                        totalPage={wishlist?.meta?.pages}
                        currentPage={pages}
                        onPageChange={handlePagination}
                    />
                </div>
            )}
        </div>
    );
};

export default Wishlist;
