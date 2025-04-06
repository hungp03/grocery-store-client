import axiosInstance from '@/utils/axios';
// Lấy các sản phẩm được chọn trong cart
export const apiGetSelectedCart = async (pids) => {
    return axiosInstance({
        url: `cart/product-selected?productIds=${pids?.join(',')}`,
        method: 'get',
    });
};

export const apiDeleteCart = async (pid) => {
    return axiosInstance({
        url: `/cart/${pid}`,
        method: 'delete'
    })
}

export const apiGetCart = async (page, size) => {
    return axiosInstance({
        url: '/cart',
        method: 'get',
        params: { page, size }
    })
}

export const apiAddOrUpdateCart = async (pid, quantity) => {
    return axiosInstance({
        url: '/cart',
        method: 'post',
        data: {
            productId: pid,
            quantity: quantity
        }
    })
}