import axiosInstance from "@/utils/axios";
export const apiAddWishList = async (pid) =>
  axiosInstance({
    url: "/wishlist",
    method: "post",
    data: {
      productId: pid,
    },
  });

export const apiGetWishlist = async (page, size) =>
  axiosInstance({
    url: "/wishlist",
    method: "get",
    params: { page, size },
  });

export const apiDeleteWishlist = async (pid) =>
  axiosInstance({
    url: `/wishlist/${pid}`,
    method: "delete",
  });
