import axiosInstance from "@/utils/axios";
export const apiGetOverview = async () =>
    axiosInstance({
        url: `admin/overview`,
    })

export const apiGetMonthlyRevenue = async (month, year) =>
    axiosInstance({
        url: `/reports/revenue/monthly`,
        method: `get`,
        params: {
            month: month,
            year: year
        }
    })

export const apiGetAllOrders = async (params = {}) => {
    const defaultParams = {
        sort: "id,desc",
        ...params,
    };

    return axiosInstance({
        url: "/orders",
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

export const apiExportExcel = async () =>
    axiosInstance({
        url: `products/export/excel`,
        method: "get",
        responseType: 'blob'
    })

export const apiGetAllRatingsPage = async (params) =>
    axiosInstance({
        url: `/ratings`,
        method: "get",
        params
    });
export const apiChangeRatingStatus = async (id) =>
    axiosInstance({
        url: `ratings/${id}/status`,
        method: "patch",
    })

export const apiSetStatusUser = async (id, status) =>
    axiosInstance({
        url: `/users/${id}/status`,
        method: "patch",
        data: {
            status
        },
    });
