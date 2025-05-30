import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiGetProduct, apiSummarizeFeedbackByProduct, apiGetRatingsPage, apiRatings, apiAddOrUpdateCart, apiAddWishList, apiGetProducts, apiGetWishlistStatus, apiDeleteWishlist } from "@/apis"
import { Breadcrumb, ProductExtraInfoItem, ProductInfomation, VoteOption, ProductCard, ProductNotFound, ProductImageSkeleton, RecommendedSkeleton, FeedbackSkeleton, BreadcrumbSkeleton, ProductInfoSkeleton, ProductImages, ProductSummary, ProductFeedbackSection } from "@/components"
import { productExtraInfo } from "@/utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { showModal } from "@/store/app/appSlice"
import Swal from "sweetalert2"
import path from "@/utils/path"
import clsx from "clsx"
import { message } from "antd"
import { getCurrentUser } from "@/store/user/asyncActions"
import { RESPONSE_STATUS } from "@/utils/responseStatus"

const ProductDetail = ({ isQuickView, data }) => {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [paginate, setPaginate] = useState(null)
  const [feedbacks, setFeedbacks] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [feedbackSummary, setFeedbackSummary] = useState(null)
  const [update, setUpdate] = useState(false)
  const [uid, setUid] = useState(null)
  const { isLoggedIn, current } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [recommendedProducts, setRecommendedProducts] = useState(null)
  const [pid, setPid] = useState(null)
  const [productNotFound, setProductNotFound] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Add loading states
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false)
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(false)

  // Add state to track if feedback data has been loaded
  const [isFeedbackDataLoaded, setIsFeedbackDataLoaded] = useState(false)

  const categories = useSelector((state) => state.app.categories);

  const categoryName = params?.category
    ? categories?.find((c) => c.slug === params.category)?.name || "Không tìm thấy"
    : "Danh mục sản phẩm";

  useEffect(() => {
    const newPid = data ? data.pid : params?.pid
    if (newPid && newPid !== pid) {
      // Reset all feedback-related state when product changes
      setPid(newPid)
      setFeedbacks(null)
      setFeedbackSummary(null)
      setIsFeedbackDataLoaded(false)
      setCurrentPage(1)
      setPaginate(null)
    }
  }, [params, data, pid])

  const fetchProductData = async () => {
    setIsLoadingProduct(true)
    try {
      const response = await apiGetProduct(pid)
      if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
        setProduct(response.data)
        setProductNotFound(false)
      } else if (response.statusCode === RESPONSE_STATUS.RESOURCE_NOT_FOUND) {
        setProductNotFound(true)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      message.error("Không thể tải thông tin sản phẩm")
    } finally {
      setIsLoadingProduct(false)
    }
  }

  const fetchRecommended = async () => {
    setIsLoadingRecommended(true)
    try {
      const res = await apiGetProducts({
        page: 1, size: 12, filter: `category.slug='${params?.category}' and id! ${pid}`,
      })
      if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
        setRecommendedProducts(res.data.result)
      }
    } catch (error) {
      console.error("Error fetching recommended products:", error)
    } finally {
      setIsLoadingRecommended(false)
    }
  }

  const fetchFeedbacksData = async (page = 1) => {
    setIsLoadingFeedbacks(true)
    try {
      const response = await apiGetRatingsPage(pid, { page, size: 10 })
      if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
        setFeedbacks(response.data?.result)
        setPaginate(response.data?.meta)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    } finally {
      setIsLoadingFeedbacks(false)
    }
  }

  const fetchsummarizeFeedbackByProduct = async (page = 1) => {
    try {
      const response = await apiSummarizeFeedbackByProduct(pid, page, 10)
      setFeedbackSummary(response || "AI tạm thời không phản hồi")
    } catch (error) {
      console.error("Error fetching feedback summary:", error)
    }
  }

  // Function to load feedback data (both feedbacks and summary)
  const loadFeedbackData = async (page = 1) => {
    if (!pid || isQuickView) return

    setIsLoadingFeedbacks(true)
    try {
      await Promise.all([
        fetchFeedbacksData(page),
        fetchsummarizeFeedbackByProduct(page)
      ])
      setIsFeedbackDataLoaded(true)
    } finally {
      setIsLoadingFeedbacks(false)
    }
  }

  // Function to handle tab change from ProductInfomation component
  const handleTabChange = useCallback((tabIndex) => {
    // If switching to review tab (tab 2) and data hasn't been loaded yet
    if (tabIndex === 2 && !isFeedbackDataLoaded) {
      loadFeedbackData(currentPage)
    }
  }, [isFeedbackDataLoaded, currentPage, pid, isQuickView])

  // Function to handle page change in feedback section
  const handleFeedbackPageChange = useCallback((page) => {
    setCurrentPage(page)
    if (isFeedbackDataLoaded) {
      loadFeedbackData(page)
    }
  }, [isFeedbackDataLoaded])

  const fetchUserData = async () => {
    if (current) {
      setUid(current.id)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (pid) {
        // Reset product-related state when fetching new product
        setProduct(null)
        setProductNotFound(false)
        setRecommendedProducts(null)
        setQuantity(1)
        setIsWishlisted(false)

        await fetchProductData()
      }
    }
    fetchData()
  }, [pid])

  useEffect(() => {
    if (product && !isQuickView) {
      fetchRecommended()
    }
  }, [product, isQuickView])

  useEffect(() => {
    if (update && isFeedbackDataLoaded && !isQuickView) {
      loadFeedbackData(currentPage)
    }
  }, [update, isFeedbackDataLoaded, isQuickView, currentPage])

  useEffect(() => {
    if (!isQuickView) {
      fetchUserData()
    }
  }, [isQuickView])

  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!pid || !isLoggedIn) return
      try {
        const res = await apiGetWishlistStatus(pid)
        if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
          setIsWishlisted(res.data?.wishlisted)
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra wishlist:", err)
      }
    }

    fetchWishlistStatus()
  }, [pid, isLoggedIn])

  const rerender = useCallback(() => {
    setUpdate((prev) => !prev)
  }, [])

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > product?.quantity) {
      message.info(`Chỉ còn ${product?.quantity} sản phẩm`)
      setQuantity(product?.quantity) // Reset về số lượng tối đa
    } else {
      setQuantity(newQuantity)
    }
  }

  const handleSubmitVoteOption = async ({ comment, score }) => {
    if (!comment || !score || !pid) {
      alert("Vui lòng nhập đầy đủ thông tin")
      return
    }
    const response = await apiRatings({ description: comment, rating: score, productId: pid, userId: uid })
    if (response.statusCode === RESPONSE_STATUS.CREATED) {
      message.success("Đánh giá thành công. Ý kiến của bạn sẽ được hiển thị sau một thời gian nữa")
      setUpdate((prev) => !prev)
    } else {
      message.error(response.message || "Đánh giá không thành công")
    }
    // Cập nhật lại feedbacks
    dispatch(showModal({ isShowModal: false, modalChildren: null }))
    rerender()
  }

  const checkLoginAndExecute = async (callback) => {
    if (!isLoggedIn) {
      const result = await Swal.fire({
        text: "Đăng nhập trước để thực hiện hành động này",
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
        showCancelButton: true,
        title: "Oops!",
      })
      if (result.isConfirmed) navigate(`/${path.LOGIN}`)
    } else {
      await callback()
    }
  }

  const handleVoteNow = () => {
    checkLoginAndExecute(() => {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: <VoteOption nameProduct={product?.productName} handleSubmitOption={handleSubmitVoteOption} />,
        }),
      )
    })
  }

  const toggleWishlist = async (pid) => {
    await checkLoginAndExecute(async () => {
      try {
        if (isWishlisted) {
          // Đã yêu thích -> xóa
          const rs = await apiDeleteWishlist(pid)
          if (rs.statusCode === RESPONSE_STATUS.SUCCESS) {
            message.success("Đã xóa khỏi danh sách yêu thích")
            setIsWishlisted(false)
          } else {
            message.warning(rs.message)
          }
        } else {
          // Chưa yêu thích -> thêm
          const rs = await apiAddWishList(pid)
          if (rs.statusCode === RESPONSE_STATUS.CREATED) {
            message.success("Đã thêm vào danh sách yêu thích")
            setIsWishlisted(true)
          } else {
            message.warning(rs.message)
          }
        }
      } catch (err) {
        console.error("Lỗi khi cập nhật wishlist:", err)
      }
    })
  }

  const addToCart = async (pid, quantity) => {
    await checkLoginAndExecute(async () => {
      const rs = await apiAddOrUpdateCart(pid, quantity)
      if (rs.statusCode === RESPONSE_STATUS.CREATED) {
        message.success(`Đã thêm vào giỏ hàng (${rs.data.quantity})`)
        dispatch(getCurrentUser())
      } else {
        message.error(rs.message)
      }
    })
  }

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      {!isQuickView && (
        <div className="h-20 flex justify-center items-center bg-gray-100">
          <div className="mx-auto w-full px-4 md:w-main md:px-0">
            {!isLoadingProduct && product ? (
              <>
                <h3 className="font-semibold text-lg md:text-xl">{product.productName}</h3>
                <Breadcrumb
                  title={product.productName}
                  category={params?.category}
                  categoryName={categoryName}
                />
              </>
            ) : (
              <BreadcrumbSkeleton />
            )}
          </div>
        </div>
      )}

      {productNotFound ? (
        <ProductNotFound />
      ) : (
        <div
          className={clsx(
            "m-auto mt-4 flex flex-col md:flex-row",
            isQuickView
              ? "max-w-[90vw] md:max-w-[900px] max-h-[80vh] bg-gray-100 rounded-lg gap-5 p-4 overflow-y-auto"
              : "w-main"
          )}
        >
          <div
            className={clsx(
              "flex flex-col gap-4",
              isQuickView
                ? "w-full md:w-1/2"
                : "w-full md:w-2/5"
            )}
          >
            {isLoadingProduct ? (
              <ProductImageSkeleton />
            ) : (
              <ProductImages imageUrl={product?.imageUrl} isLoading={isLoadingProduct} />
            )}
          </div>

          <div
            className={clsx(
              "flex flex-col gap-4 mt-6 md:mt-0",
              isQuickView
                ? "w-full md:w-1/2"
                : "w-full md:w-2/5"
            )}
          >
            {isLoadingProduct ? (
              <ProductInfoSkeleton />
            ) : product ? (
              <ProductSummary
                product={product}
                quantity={quantity}
                isWishlisted={isWishlisted}
                onQuantityChange={handleQuantityChange}
                onAddToCart={() => addToCart(product.id, quantity)}
                onToggleWishlist={() => toggleWishlist(pid)}
              />
            ) : null}
          </div>

          {!isQuickView && (
            <div className="hidden md:block md:w-1/5 md:ml-4">
              {productExtraInfo.map((e) => (
                <ProductExtraInfoItem
                  key={e.id}
                  title={e.title}
                  sub={e.sub}
                  icon={e.icon}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!isQuickView && !productNotFound && (
        <>
          <div className="mx-auto w-full mt-8 px-4 md:w-main md:px-0">
            <ProductInfomation
              des={product?.description}
              onTabChange={handleTabChange}
              review={
                isLoadingFeedbacks ? (
                  <FeedbackSkeleton />
                ) : (
                  <ProductFeedbackSection
                    product={product}
                    feedbacks={feedbacks}
                    feedbackSummary={feedbackSummary}
                    isLoadingFeedbacks={isLoadingFeedbacks}
                    paginate={paginate}
                    onPageChange={handleFeedbackPageChange}
                    onVote={handleVoteNow}
                  />
                )
              }
              rerender={rerender}
            />
          </div>

          <div className="w-full flex justify-center mb-4">
            <div className="mx-auto w-full px-4 md:w-main md:px-0">
              <h2 className="text-[20px] uppercase font-semibold py-2 border-b-4 border-main">
                Sản phẩm tương tự
              </h2>
              {isLoadingRecommended ? (
                <RecommendedSkeleton />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                  {recommendedProducts?.map((e) => (
                    <ProductCard key={e.id} productData={e} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default ProductDetail;