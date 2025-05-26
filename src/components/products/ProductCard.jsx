import React, { useState } from "react";
import { formatMoney, renderStarFromNumber} from "@/utils/helper";
import { SelectOption } from "..";
import icons from "@/utils/icons";
import withBaseComponent from "@/hocs/withBaseComponent";
import product_default from '@/assets/product_default.png';
import { showModal } from "@/store/app/appSlice";
import ProductDetail from "@/pages/guest/ProductDetail";
import { apiAddOrUpdateCart, apiAddWishList } from "@/apis";
import { message } from "antd";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "@/utils/path";
import { getCurrentUser } from "@/store/user/asyncActions";
import { RESPONSE_STATUS } from "@/utils/responseStatus";

const { FaCartShopping, FaHeart, FaEye } = icons;

const ProductCard = ({ productData, navigate, dispatch }) => {
  const [showOption, setShowOption] = useState(false);
  const { isLoggedIn } = useSelector(state => state.user)

  const handleLoginCheck = async () => {
    if (!isLoggedIn) {
      const result = await Swal.fire({
        text: "Vui lòng đăng nhập",
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
        showCancelButton: true,
        icon: 'info',
        title: "Oops!"
      });
      if (result.isConfirmed) navigate(`/${path.LOGIN}`);
      return false;
    }
    return true;
  };

  const handleClickOptions = async (e, flag) => {
    e.stopPropagation();
    if (flag === 'QUICK_VIEW') {
      dispatch(showModal({
        isShowModal: true,
        modalChildren: <ProductDetail isQuickView data={{ pid: productData?.id, category: productData?.category }} />
      }))
    }

    if (flag === 'ADD_TO_CART') {
      const isLoggedInCheck = await handleLoginCheck();
      if (!isLoggedInCheck) return;

      const res = await apiAddOrUpdateCart(productData?.id, 1);
      if (res.statusCode === RESPONSE_STATUS.CREATED) {
        message.success('Đã thêm vào giỏ hàng');
        dispatch(getCurrentUser());
      } else {
        message.error(res.message);
      }
    }

    if (flag === 'ADD_WISHLIST') {
      const isLoggedInCheck = await handleLoginCheck();
      if (!isLoggedInCheck) return;

      const res = await apiAddWishList(productData?.id);
      if (res.statusCode === RESPONSE_STATUS.CREATED) {
        message.success('Đã thêm vào danh sách yêu thích');
      } else {
        message.warning(res.message);
      }
    }
  };

  return (
    <div className="w-full h-auto text-base px-[10px]">
      <div
        onClick={e => navigate(`/products/${encodeURIComponent(productData?.category)}/${productData?.id}`)}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setShowOption(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setShowOption(false);
        }}
        className="w-full border p-[15px] flex flex-col items-center"
      >
        <div className="w-full relative flex items-center justify-center">
          {showOption && (
            <div className="absolute bottom-[-10px] flex justify-center left-0 right-0 gap-2 animate-slide-top">
              <div
                className="py-2 cursor-pointer"
                onClick={(e) => handleClickOptions(e, 'QUICK_VIEW')}
              >
                <span title="Quick view"><SelectOption key={productData.id + '0'} icon={<FaEye />} /></span>
              </div>
              <div
                className='py-2 cursor-pointer'
                onClick={(e) => {
                  if (productData?.quantity > 0) {
                    handleClickOptions(e, 'ADD_TO_CART');
                  }
                  else{
                    e.stopPropagation();
                    message.info("Sản phẩm đang tạm hết hàng")
                  }
                }}
              >
                <span title="Add to Cart"  className={`${productData?.quantity <=0 ? 'opacity-50' : ''}`}>
                  <SelectOption key={productData.id + '1'} icon={<FaCartShopping />}/>
                </span>
              </div>

              <div
                className="py-2 cursor-pointer"
                onClick={(e) => handleClickOptions(e, 'ADD_WISHLIST')}
              >
                <span title="Add to Wishlist"><SelectOption key={productData.id + '2'} icon={<FaHeart />} /></span>
              </div>
            </div>
          )}

          <div className="aspect-w-1 aspect-h-1">
            <img
              // src={productData?.imageUrl || product_default}
              src={
                productData?.imageUrl
                  || product_default
              }
              alt=""
              className="object-cover w-full h-40"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
          <span className="line-clamp-1">{productData?.productName}</span>
          <span className="flex">
            {renderStarFromNumber(productData?.rating)}
          </span>
          <span className="text-main">
            {formatMoney(productData?.price)} &#8363;
          </span>
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(ProductCard);
