import React from 'react'
import { Tooltip } from "antd"
import { formatMoney, renderStarFromNumber } from "@/utils/helper"
import { QuantitySelector, Button } from "@/components"
import icons from "@/utils/icons"
import { tr } from 'date-fns/locale'
const { FaHeart } = icons

const ProductSummary = ({
    product,
    quantity,
    isWishlisted,
    onQuantityChange,
    onAddToCart,
    onToggleWishlist,
}) => {
    const inStock = product?.quantity > 0

    return (
        <div className="flex flex-col gap-6 w-full pl-4">
            <div className="flex flex-wrap justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-semibold">
                    {formatMoney(product?.price)}đ
                </h2>
                <span className="text-sm text-red-500 mt-1">
                    Có sẵn: {product?.quantity}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">
                    {Number.parseFloat((product?.rating || 0).toFixed(1))}
                </span>
                {renderStarFromNumber(product?.rating || 0)?.map((el, idx) => (
                    <span key={idx}>{el}</span>
                ))}
                <span className="text-sm text-red-500 ml-auto md:ml-2 mt-1">
                    Đã bán {product?.sold || 0}
                </span>
            </div>

            <div className="text-sm text-gray-500">
                Đơn vị: {product?.unit || "Không"}
            </div>
            <div className="flex flex-col gap-4">
                {inStock ? (
                    <>
                        <div className="flex flex-wrap items-center gap-4">
                            <span>Số lượng</span>
                            <QuantitySelector
                                quantity={quantity}
                                stock={product.quantity}
                                onIncrease={() => onQuantityChange(quantity + 1)}
                                onDecrease={() => onQuantityChange(Math.max(quantity - 1, 1))}
                                onChange={onQuantityChange}
                            />
                            <Tooltip
                                title={
                                    isWishlisted
                                        ? "Xóa khỏi danh sách yêu thích"
                                        : "Thêm vào danh sách yêu thích"
                                }
                                color={isWishlisted ? "#EF4444" : "#10B981"}
                            >
                                <span
                                    className="cursor-pointer"
                                    onClick={onToggleWishlist}
                                >
                                    <FaHeart
                                        size={20}
                                        color={isWishlisted ? "#EF4444" : "#10B981"}
                                    />
                                </span>
                            </Tooltip>
                        </div>
                        <Button
                            className="md:w-full"
                            handleOnClick={onAddToCart}
                        >
                            Thêm vào giỏ
                        </Button>
                    </>
                ) : (
                    <p className="text-red-500">
                        Sản phẩm đang tạm hết hàng, bạn vui lòng quay lại sau nhé
                    </p>
                )}
            </div>
        </div>
    )
}

export default ProductSummary
