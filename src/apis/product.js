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
        url: `/product/${pid}/ratings`,
        method: "get",
        params,
    });

export const apiCreateProduct = async (product) => 
 axiosInstance({
        url: `/products`,
        method: 'post',
        data: product,
    })


export const apiUpdateProduct2 = async (id, product) => 
    axiosInstance({
        url: `/products/${id}`,
        method: 'put',
        data: product,
    })
 



