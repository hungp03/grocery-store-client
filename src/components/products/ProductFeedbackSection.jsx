import React from 'react'
import { Button, Pagination, Votebar, Comment, FeedbackSkeleton } from "@/components"
import icons from '@/utils/icons'
import { renderStarFromNumber } from "@/utils/helper"
import clsx from 'clsx'

const { SiGooglegemini } = icons

const ProductFeedbackSection = ({
  product,
  feedbacks,
  feedbackSummary,
  isLoadingFeedbacks,
  paginate,
  onPageChange,
  onVote,
}) => {
  if (isLoadingFeedbacks) return <FeedbackSkeleton />

  return (
    <div className="w-full">
      <div className="p-4 flex flex-col md:flex-row">
        <div className="flex flex-col items-center justify-center w-full md:w-2/5">
          <span className="font-semibold text-3xl">
            {`${Number.parseFloat((product?.rating || 0).toFixed(1))}/5`}
          </span>
          <span className="flex items-center gap-1 mt-1">
            {renderStarFromNumber(product?.rating || 0)?.map((el, idx) => (
              <span key={idx}>{el}</span>
            ))}
          </span>
          <span className="mt-1">{`${feedbacks?.length || 0} đánh giá`}</span>
          <span className="text-gray-600 text-xs italic mt-1 text-center">
            Một số bình luận có thể bị ẩn do không hợp lệ
          </span>
        </div>

        <div className="flex flex-col gap-2 py-8 w-full md:w-3/5">
          {Array.from({ length: 5 }, (_, i) => 5 - i).map((star) => (
            <Votebar
              key={star}
              number={star}
              ratingCount={feedbacks?.filter((f) => f.ratingStar === star).length || 0}
              ratingTotal={feedbacks?.length || 0}
            />
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col md:flex-row items-center justify-center text-sm gap-2">
        <span>Bạn đánh giá sao sản phẩm này</span>
        <Button handleOnClick={onVote}>Đánh giá ngay</Button>
      </div>

      {feedbackSummary && (
        <div
          className={clsx(
            "p-4 flex flex-col gap-2 text-sm w-full",
            "md:flex-row md:items-start md:ml-8"
          )}
        >
          <div className="text-lg font-semibold">
            <p className="flex items-center gap-2">
              <SiGooglegemini className="text-lg text-blue-500" />
              Tóm tắt bởi AI
            </p>
            <p className="italic text-sm font-normal text-gray-700 md:ml-4">
              {feedbackSummary}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4">
        {feedbacks?.map((el, idx) => (
          <Comment
            key={idx}
            ratingStar={el.ratingStar}
            content={el.description}
            updatedAt={el.updatedAt}
            name={el.userName}
            image={el.userAvatarUrl}
          />
        ))}
      </div>

      {/* Phân trang */}
      {paginate?.pages > 1 && (
        <div className="px-4 md:px-0">
          <Pagination
            totalPage={paginate.pages}
            currentPage={paginate.page}
            pageSize={paginate.pageSize}
            totalProduct={paginate.total}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default ProductFeedbackSection
