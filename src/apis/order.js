import axiosInstance from "@/utils/axios";


export const apiGetOrderDetail = async (oid) =>
    axiosInstance({
        url: `/order/${oid}/detail`,
        method: "get",
    })
export const apiGetOrderInfor = async (oid) =>
    axiosInstance({
        url: `/orders/${oid}/info`,
        method: "get",
    })



export const apiPaymentVNPay = async (params) =>
    axiosInstance({
        url: `payment/vn-pay`,
        method: 'post',
        params,
    })

// Tạo order
export const apiCreateOrder = async (data) => {
    const requestBody = {
        address: data.address,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
        totalPrice: data.totalPrice,
        items: data.items
    };

    return axiosInstance({
        url: `/orders/checkout`,
        method: 'post',
        data: requestBody,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const apiUpdateOrderStatus = async (orderId, status) =>
    axiosInstance({
        url: `orders/${orderId}/status`,
        data: { status: status },
        method: 'patch'
    })

export const apiGetMyOrders = async (params) =>
    axiosInstance({
        url: `/orders/me`,
        method: "get",
        params
    });