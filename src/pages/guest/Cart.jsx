import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { CartItem, CartFooter, EmptyCart } from '@/components';
import { apiGetCart, apiAddOrUpdateCart, apiDeleteCart } from '@/apis';
import { getCurrentUser } from '@/store/user/asyncActions';
import withBaseComponent from '@/hocs/withBaseComponent';
import path from '@/utils/path';
import { RESPONSE_STATUS } from "@/utils/responseStatus";
import { CircleLoader } from 'react-spinners';

const DEBOUNCE_DELAY = 500;
const DELETE_DELAY = 500;
const ITEMS_PER_PAGE = 10;

const Cart = ({ dispatch }) => {
  const { current, isLoggedIn } = useSelector(state => state.user)
  const navigate = useNavigate();

  // States
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(new Set());
  const [loadingDeletes, setLoadingDeletes] = useState(new Set());
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [allSelectedItems, setAllSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0)
  // Refs
  const debounceTimeouts = useRef({});
  const pendingChanges = useRef({});

  // API Functions
  const deleteProductInCart = async (pid) => {
    const res = await apiDeleteCart(pid);
    const messages = {
      [RESPONSE_STATUS.SUCCESS]: "Đã xóa sản phẩm",
      [RESPONSE_STATUS.RESOURCE_NOT_FOUND]: "Sản phẩm không tồn tại trong giỏ hàng",
    };
    message[res.statusCode === RESPONSE_STATUS.SUCCESS ? 'success' : 'error'](messages[res.statusCode] || "Có lỗi trong quá trình xóa");
    res.statusCode === RESPONSE_STATUS.SUCCESS && dispatch(getCurrentUser());
  };

  const fetchCartItems = async (pageToFetch = 1, pageSize = ITEMS_PER_PAGE) => {
    setIsLoading(true);
    const response = await apiGetCart(pageToFetch, pageSize);
    if (response.statusCode === RESPONSE_STATUS.USER_NOT_FOUND) {
      message.error("Thông tin người dùng không hợp lệ");
      setIsLoading(false);
      return;
    }
    if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
      const products = response.data.result;
      setTotal(response?.data?.meta?.total)
      setCartItems((prevItems) => {
        const updatedItems = pageToFetch === 1 ? products : [...prevItems, ...products];
        return updatedItems;
      });
      setHasMore(products.length === pageSize);
      setPage(pageToFetch);
    } else {
      message.error("Có lỗi khi tải dữ liệu giỏ hàng");
    }
    setIsLoading(false);
  };

  // Handler Functions
  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchCartItems(page + 1);
    }
  };

  const toggleSelectItem = (pid) => {
    setSelectedItems((prevSelectedItems) => {
      const newSet = new Set(prevSelectedItems);
      if (newSet.has(pid)) {
        newSet.delete(pid);
      } else {
        newSet.add(pid);
      }
      return newSet;
    });

    setAllSelectedItems((prevSelected) => {
      const existingItem = prevSelected.find(item => item.id === pid);
      if (existingItem) {
        return prevSelected.filter(item => item.id !== pid);
      } else {
        const newItem = cartItems.find(item => item.id === pid);
        return [...prevSelected, newItem];
      }
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
      setAllSelectedItems([]);
    } else {
      const newSelectedItems = new Set(
        cartItems
          .filter(item => (item.stock > 0 && item.stock >= item.quantity && item.isActive))
          .map(item => item.id)
      );
      setSelectedItems(newSelectedItems);
      setAllSelectedItems(cartItems.filter(item => item.stock > 0 && item.stock >= item.quantity && item.isActive));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleQuantityChange = (pid, newQuantity) => {
    const currentItem = cartItems.find(item => item.id === pid);
    if (!currentItem) return;

    const validatedQuantity =
      newQuantity === '' || isNaN(newQuantity) || newQuantity < 1
        ? 1
        : Math.min(newQuantity, currentItem.stock);

    const quantityDifference = validatedQuantity - currentItem.quantity;
    if (quantityDifference === 0) return;

    // Add to pending updates
    setPendingUpdates(prev => new Set(prev).add(pid));

    // Update cart items
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === pid ? { ...item, quantity: validatedQuantity } : item
      )
    );

    const currentPendingChange = pendingChanges.current[pid] || 0;
    pendingChanges.current[pid] = currentPendingChange + quantityDifference;
    if (debounceTimeouts.current[pid]) {
      clearTimeout(debounceTimeouts.current[pid]);
    }

    // Set new timeout for API call
    debounceTimeouts.current[pid] = setTimeout(async () => {
      const finalChange = pendingChanges.current[pid];
      if (finalChange !== undefined) {
        const rs = await apiAddOrUpdateCart(pid, finalChange);
        if (rs.statusCode === RESPONSE_STATUS.CREATED) {
          message.success(`Đã cập nhật số lượng mới: ${rs.data.quantity}`);
        } else if (rs.statusCode === RESPONSE_STATUS.RESOURCE_NOT_FOUND) {
          message.error(rs.message);
        } else {
          message.error("Có lỗi xảy ra");
        }
        delete pendingChanges.current[pid];

        setPendingUpdates(prev => {
          const newSet = new Set(prev);
          newSet.delete(pid);
          return newSet;
        });
      }
    }, DEBOUNCE_DELAY);
  };

  const increaseQuantity = (pid) => {
    const item = cartItems.find((item) => item.id === pid);
    if (item && item.quantity < item.stock) {
      handleQuantityChange(pid, item.quantity + 1);
    }
  };

  const decreaseQuantity = (pid) => {
    const item = cartItems.find((item) => item.id === pid);
    if (item && item.quantity > 1) {
      handleQuantityChange(pid, item.quantity - 1);
    }
  };

  const removeItem = (pid) => {
    if (pendingUpdates.size > 0) return;

    setLoadingDeletes(prev => new Set(prev).add(pid));
    setTimeout(() => {
      deleteProductInCart(pid);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== pid));
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(pid);
        return newSet;
      });
      setLoadingDeletes(prev => {
        const newSet = new Set(prev);
        newSet.delete(pid);
        return newSet;
      });
    }, DELETE_DELAY);
  };


  const calculateSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toLocaleString('vi-VN');
  };

  const handleCheckout = () => {
    if (!isCheckoutDisabled && selectedItems.size > 0) {
      navigate(`/${path.CHECKOUT}`, {
        state: {
          selectedItems: Array.from(selectedItems)
        }
      });
    }
  };

  // Effects
  useEffect(() => {
    if (isLoggedIn && current) {
      fetchCartItems(1, ITEMS_PER_PAGE);
    }

    return () => {
      // Cleanup pending timeouts
      Object.values(debounceTimeouts.current).forEach(timeout => clearTimeout(timeout));
      // Process any pending changes
      Object.entries(pendingChanges.current).forEach(([pid, change]) => {
        if (change !== undefined) {
          apiAddOrUpdateCart(pid, change);
        }
      });
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const isAnyQuantityInvalid = cartItems.some(
      (item) => {
        // Kiểm tra sản phẩm được chọn
        if (!selectedItems.has(item.id)) return false;

        return (
          item.quantity < 1 ||
          isNaN(item.quantity) ||
          item.quantity > item.stock ||
          item.stock <= 0
        );
      }
    );

    // Chỉ vô hiệu hóa nút khi:
    // 1. Có cập nhật đang pending
    // 2. Có xóa đang pending
    // 3. Không có sản phẩm nào được chọn
    // 4. Có sản phẩm được chọn nhưng số lượng không hợp lệ
    setIsCheckoutDisabled(
      pendingUpdates.size > 0 ||
      loadingDeletes.size > 0 ||
      selectedItems.size === 0 ||
      isAnyQuantityInvalid
    );
  }, [cartItems, pendingUpdates, loadingDeletes, selectedItems]);

  useEffect(() => {
    const validItems = cartItems.filter(item => (
      item.stock > 0 && item.stock >= item.quantity && item.isActive
    ));
    setIsAllSelected(
      selectedItems.size === validItems.length &&
      cartItems.length > 0 &&
      selectedItems.size !== 0
    );
  }, [selectedItems, cartItems]);

  return (
    <div className="w-full px-4 md:w-main md:mx-auto mt-10 p-6 bg-white shadow-md rounded-lg min-h-[30vh]">
      <h2 className="text-xl font-semibold mb-6">Giỏ hàng</h2>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[20vh]">
          <CircleLoader color="#36d7b7" loading={isLoading} size={30} />
        </div>
      ) : cartItems.length > 0 ? (
        <div className="space-y-6">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onToggleSelect={toggleSelectItem}
              onQuantityChange={handleQuantityChange}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeItem}
              isCheckoutDisabled={isCheckoutDisabled}
              loadingDeletes={loadingDeletes}
              pendingUpdates={pendingUpdates}
            />
          ))}

          <CartFooter
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={loadMore}
            selectedTotal={calculateSelectedTotal()}
            isAllSelected={isAllSelected}
            onToggleSelectAll={toggleSelectAll}
            isCheckoutDisabled={isCheckoutDisabled}
            onCheckout={handleCheckout}
            pendingUpdates={pendingUpdates}
            loadingDeletes={loadingDeletes}
          />
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default withBaseComponent(Cart);