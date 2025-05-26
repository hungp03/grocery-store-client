import React, { memo, useState, useCallback, useEffect } from 'react'
import clsx from 'clsx'

const ProductInfomation = ({ des, review, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(1)

  // Reset to first tab when product changes (when des changes)
  useEffect(() => {
    setActiveTab(1)
  }, [des])

  const handleTabClick = useCallback((tabIndex) => {
    setActiveTab(tabIndex)
    // Notify parent component about tab change
    if (onTabChange) {
      onTabChange(tabIndex)
    }
  }, [onTabChange])

  return (
    <div className="w-full px-4 sm:px-0">
      {/* TAB BUTTONS: mobile flex-col, desktop flex-row */}
      <div className="flex flex-col md:flex-row items-stretch gap-2 mb-[-1px]">
        <button
          onClick={() => handleTabClick(1)}
          className={clsx(
            "w-full md:w-auto text-center py-2 px-4 cursor-pointer",
            activeTab === 1
              ? "bg-white border border-b-0"
              : "bg-gray-200 border"
          )}
        >
          Mô tả sản phẩm
        </button>
        <button
          onClick={() => handleTabClick(2)}
          className={clsx(
            "w-full md:w-auto text-center py-2 px-4 cursor-pointer",
            activeTab === 2
              ? "bg-white border border-b-0"
              : "bg-gray-200 border"
          )}
        >
          Đánh giá
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="w-full border p-4 bg-white">
        {activeTab === 1 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold md:hidden">Mô tả sản phẩm</h3>
            <div className="break-words">{des}</div>
          </div>
        )}
        {activeTab === 2 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold md:hidden">Đánh giá</h3>
            <div>{review}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ProductInfomation)