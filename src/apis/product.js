import axiosInstance from "@/utils/axios";
export const apiGetProducts = async (params) =>
    axiosInstance({
        url: "/products",
        method: "get",
        params,
        paramsSerializer: {
            encode: (value) => value,
            serialize: (params) => {
                return Object.entries(params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
            }
        }
    });

export const apiSearchProducts = async (params) =>
    axiosInstance({
        url: "/products/search",
        method: "get",
        params,
        paramsSerializer: {
            encode: (value) => value,
            serialize: (params) => {
                return Object.entries(params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
            }
        }
    });

export const apiGetProduct = async (pid) =>
    axiosInstance({
        url: `/products/${pid}`,
        method: "get",
    });

export const apiDeleteProduct = async (pid) =>
    axiosInstance({
        url: `/products/${pid}`,
        method: 'delete',
    });


export const apiRatings = async (data) =>
    axiosInstance({
        url: `/product/ratings`,
        method: "post",
        data
    });

export const apiGetRatingsPage = async (pid, params) =>
    axiosInstance({
        url: `/product/ratings/${pid}`,
        method: "get",
        params,
    });

export const apiCreateProduct = async (product) => 
 axiosInstance({
        url: `/products`,
        method: 'post',
        data: product,
    })


export const apiUpdateProduct2 = async (product) => 
    axiosInstance({
        url: `/products`,
        method: 'put',
        data: product,
    })
 

// Lấy danh sách orders
export const apiGetOrders = async (params) =>
    axiosInstance({
        url: `/orders`,
        method: "get",
        params
    });

export const apiGetAllRatingsPage = async (params) =>
    axiosInstance({
        url: `/ratings`,
        method: "get",
        params
    });
export const apiChangeRatingStatus = async (id) =>
    axiosInstance({
        url: `ratings/${id}`,
        method: "put",
    })

export const apiFetchRecommendProductById = async (id) =>
    axiosInstance({
        url: `products/similar/${id}`,
        method: "get",
    })

export const apiFetchRecommendSearchProduct = async (word, page, pagesize) =>
    axiosInstance({
        url: `search-recommended/${word}`,
        method: "get",
        params: { page, pagesize }
    })

export const apiRecommendProductForUser = async () =>
    axiosInstance({
        url: 'recommend-product',
        method: "get",
    })

export const apiExportExcel = async () =>
    axiosInstance({
        url: `products/exportExcel`,
        method: "get",
        responseType: 'blob'
    })