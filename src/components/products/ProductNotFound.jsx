import React from 'react'
import { useNavigate } from 'react-router-dom'
import path from '@/utils/path'
import { Button } from "@/components"
const ProductNotFound = () => {
    const navigate = useNavigate()
    return (
        <div className="w-main mx-auto my-12 p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-6 py-8">
                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-red-50 text-red-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-600 text-center max-w-md">
                    Sản phẩm không tồn tại hoặc đã ngừng kinh doanh. Vui lòng quay lại sau hoặc tìm kiếm sản phẩm khác.
                </p>
                <div className="flex gap-4 mt-2">
                    <Button handleOnClick={() => navigate("/")}>Về trang chủ</Button>
                    <Button handleOnClick={() => navigate(`/${path.PRODUCTS_BASE}`)} variant="outline">
                        Xem sản phẩm khác
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductNotFound