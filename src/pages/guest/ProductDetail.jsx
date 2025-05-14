import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiGetProduct, apiGetRatingsPage, apiRatings, apiAddOrUpdateCart, apiAddWishList, apiGetProducts, apiGetWishlistStatus, apiDeleteWishlist } from "@/apis"
import { Pagination, Breadcrumb, Button, QuantitySelector, ProductExtraInfoItem, ProductInfomation, VoteOption, Comment, ProductCard, ProductNotFound, ProductImageSkeleton, RecommendedSkeleton, FeedbackSkeleton, BreadcrumbSkeleton, ProductInfoSkeleton } from "@/components"
import { formatMoney, renderStarFromNumber } from "@/utils/helper"
import product_default from "@/assets/product_default.png"
import { productExtraInfo } from "@/utils/constants"
import Votebar from "@/components/vote/Votebar"
import { useDispatch, useSelector } from "react-redux"
import { showModal } from "@/store/app/appSlice"
import Swal from "sweetalert2"
import path from "@/utils/path"
import clsx from "clsx"
import { message, Tooltip } from "antd"
import icons from "@/utils/icons"
import { getCurrentUser } from "@/store/user/asyncActions"
import { RESPONSE_STATUS } from "@/utils/responseStatus"

const { FaHeart } = icons
const ProductDetail = ({ isQuickView, data }) => {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [paginate, setPaginate] = useState(null)
  const [feedbacksPage, setFeedbacksPage] = useState(null)
  const [feedbacks, setFeedbacks] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
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

  const categories = useSelector((state) => state.app.categories);

  const categoryName = params?.category
    ? categories?.find((c) => c.slug === params.category)?.name || "Không tìm thấy"
    : "Danh mục sản phẩm";

  useEffect(() => {
    if (data) {
      setPid(data.pid)
    } else if (params) {
      setPid(params.pid)
    }
  }, [params, data])

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
      const response = await apiGetRatingsPage(pid, { page, size: 5 })
      if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
        setFeedbacks(response.data?.result)
        setFeedbacksPage(response.data?.result)
        setPaginate(response.data)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    } finally {
      setIsLoadingFeedbacks(false)
    }
  }

  const fetchUserData = async () => {
    if (current) {
      setUid(current.id)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (pid) {
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
    if (product && !isQuickView) {
      fetchFeedbacksData(currentPage)
    }
  }, [product, isQuickView, currentPage, update])

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
    await apiRatings({ description: comment, rating: score, productId: pid, userId: uid })
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
          <div className="w-main">
            {!isLoadingProduct && product ? (
              <>
                <h3 className="font-semibold">{product?.productName}</h3>
                <Breadcrumb title={product?.productName} category={params?.category} categoryName={categoryName} />
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
            "m-auto mt-4 flex",
            isQuickView ? "max-w-[900px] max-h-[80vh] bg-gray-100 rounded-lg gap-5 p-4 overflow-y-auto" : "w-main",
          )}
        >
          <div className={clsx("flex-4 flex flex-col gap-4 ", isQuickView ? "w-1/2" : "w-2/5")}>
            {isLoadingProduct ? (
              <ProductImageSkeleton />
            ) : (
              <div className="w-[450px]">
                <div className="px-2">
                  <img
                    src={
                      product?.imageUrl
                      || product_default
                    }
                    alt="product"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
          <div className={clsx("flex flex-col gap-4", isQuickView ? "w-1/2" : "w-2/5 ")}>
            {isLoadingProduct ? (
              <ProductInfoSkeleton />
            ) : product ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-[30px] font-semibold">{`${formatMoney(product?.price)}đ`}</h2>
                  <span className="text-sm text-red-500 ml-2 mt-1 pr-2">{`Có sẵn: ${product?.quantity}`}</span>
                </div>
                <div className="flex items-center">
                  {Number.parseFloat(product?.rating?.toFixed(1) || 0)}
                  {renderStarFromNumber(product?.rating || 0)?.map((el, index) => (
                    <span key={index}>{el}</span>
                  ))}
                  <span className="text-sm text-red-500 ml-2 mt-1">{`Đã bán ${product?.sold || 0}`}</span>
                </div>
                <ul className="text-smtext-gray-500">{`Đơn vị: ${product?.unit || "Không"}`}</ul>
                <div className="flex flex-col gap-8">
                  {product?.quantity > 0 ? (
                    <>
                      <div className="flex items-center gap-4">
                        <span>Số lượng</span>
                        <QuantitySelector
                          quantity={quantity}
                          stock={product?.quantity}
                          onIncrease={() => handleQuantityChange(quantity + 1)}
                          onDecrease={() => handleQuantityChange(Math.max(quantity - 1, 1))}
                          onChange={handleQuantityChange}
                        />
                        <Tooltip
                          title={isWishlisted ? "Xóa khỏi danh sách yêu thích" : "Thêm vào danh sách yêu thích"}
                          color={isWishlisted ? "#EF4444" : "#10B981"}
                        >
                          <span
                            className="cursor-pointer"
                            onClick={() => toggleWishlist(pid)}
                          >
                            <FaHeart size={20} color={isWishlisted ? "#EF4444" : "#10B981"} />
                          </span>
                        </Tooltip>
                      </div>

                      <Button fw handleOnClick={() => addToCart(product?.id, quantity)}>
                        Thêm vào giỏ hàng
                      </Button>
                    </>
                  ) : (
                    <p className="text-red-500">Sản phẩm đang tạm hết hàng, bạn vui lòng quay lại sau nhé</p>
                  )}
                </div>
              </>
            ) : null}
          </div>
          {!isQuickView && (
            <div className="flex-2 w-1/5 ml-4">
              {productExtraInfo.map((e) => (
                <ProductExtraInfoItem key={e.id} title={e.title} sub={e.sub} icon={e.icon} />
              ))}
            </div>
          )}
        </div>
      )}
      {!isQuickView && !productNotFound && (
        <>
          <div className="w-main m-auto mt-8">
            <ProductInfomation
              des={product?.description}
              review={
                <div>
                  {isLoadingFeedbacks ? (
                    <FeedbackSkeleton />
                  ) : (
                    <>
                      <div className="flex p-4">
                        <div className="flex-4 flex flex-col items-center justify-center">
                          <span className="font-semibold text-3xl">{`${Number.parseFloat((product?.rating || 0).toFixed(1))}/5`}</span>
                          <span className="flex items-center gap-1">
                            {renderStarFromNumber(product?.rating || 0)?.map((el, index) => (
                              <span key={index}>{el}</span>
                            ))}
                          </span>
                          <span>{`${feedbacks?.length || 0} đánh giá`}</span>
                          <span className="text-gray-600 text-xs italic">
                            Một số bình luận có thể bị ẩn do không hợp lệ
                          </span>
                        </div>
                        <div className="flex-6 flex flex-col gap-2 py-8">
                          {Array.from(Array(5).keys())
                            .reverse()
                            .map((el) => (
                              <Votebar
                                key={el}
                                number={el + 1}
                                ratingCount={feedbacks?.filter((i) => i.ratingStar === el + 1)?.length || 0}
                                ratingTotal={feedbacks?.length || 0}
                              />
                            ))}
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
                        <span>Bạn đánh giá sao sản phẩm này</span>
                        <Button handleOnClick={handleVoteNow}>Đánh giá ngay</Button>
                      </div>
                      <div className="flex flex-col gap-4">
                        {feedbacksPage?.map((el, index) => (
                          <Comment
                            key={index}
                            ratingStar={el.ratingStar}
                            content={el.description}
                            updatedAt={el.updatedAt}
                            name={el.userName}
                            image={el?.userAvatarUrl}
                          />
                        ))}
                      </div>
                      {paginate?.pages > 1 && (
                        <div>
                          <Pagination
                            totalPage={paginate?.pages}
                            currentPage={paginate?.page}
                            pageSize={paginate?.pageSize}
                            totalProduct={paginate?.total}
                            onPageChange={(page) => setCurrentPage(page)}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              }
              rerender={rerender}
            />
          </div>
          <div className="w-full flex justify-center">
            <div className="w-main">
              <h2 className="text-[20px] uppercase font-semibold py-2 border-b-4 border-main">Sản phẩm tương tự</h2>
              {isLoadingRecommended ? (
                <RecommendedSkeleton />
              ) : (
                <div className="grid grid-cols-6 gap-4 mt-4 ">
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
  )
}
export default ProductDetail

