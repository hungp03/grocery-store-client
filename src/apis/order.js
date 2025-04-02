import axiosInstance from "@/utils/axios";
export const apiGetAllOrders = async (params = {}) => {
    const defaultParams = {
        sort: "id,desc",
        ...params,
    };

    return axiosInstance({
        url: "/all-orders",
        method: "get",
        params: defaultParams,
        paramsSerializer: {
            encode: (value) => value,
            serialize: (params) => {
                return Object.entries(params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
            }
        }
    });
};

export const apiGetOrderDetail = async (oid) =>
    axiosInstance({
        url: `/order-detail/${oid}`,
        method: "get",
    })
export const apiGetOrderInfor = async (oid) =>
    axiosInstance({
        url: `/order-info/${oid}`,
        method: "get",
    })

export const apiGetMonthlyRevenue = async (month, year) =>
    axiosInstance({
        url: `monthly-orders-revenue`,
        method: `get`,
        params: {
            month: month,
            year: year
        }
    })

export const apiUpdateOrderStatus = async (orderId, status) =>
    axiosInstance({
        url: `update-order-status/${orderId}`,
        params: { status: status },
        method: 'put'
    })

export const apiGetSummary = async () =>
    axiosInstance({
        url: `admin/summary`,
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
        url: `/checkout`,
        method: 'post',
        data: requestBody,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}