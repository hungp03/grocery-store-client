import axiosInstance from '@/utils/axios';
// Lấy các sản phẩm được chọn trong cart
export const apiGetSelectedCart = async (pids) => 
    axiosInstance({
        url: `cart/selected?productIds=${pids?.join(',')}`,
        method: 'get',
    });


export const apiDeleteCart = async (pid) => 
    axiosInstance({
        url: `/cart/${pid}`,
        method: 'delete'
    })


export const apiGetCart = async (page, size) => 
    axiosInstance({
        url: '/cart',
        method: 'get',
        params: { page, size }
    })


export const apiAddOrUpdateCart = async (pid, quantity) => 
    axiosInstance({
        url: '/cart',
        method: 'post',
        data: {
            productId: pid,
            quantity: quantity
        }
    })