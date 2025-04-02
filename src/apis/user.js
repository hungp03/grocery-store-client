import axiosInstance from "@/utils/axios";

export const apiRegister = async (data) =>
    axiosInstance({
        url: "/auth/register",
        method: "post",
        data,
        withCredentials: true
    });

export const apiLogin = async (data) =>
    axiosInstance({
        url: "/auth/login",
        method: "post",
        data,
        withCredentials: true
    });

export const apiLoginGoogle = async (data) => {
    return axiosInstance({
        url: "/auth/signin/google",
        method: "post",
        data,
        withCredentials: true
    });
};


export const apiGetCurrentUser = async () =>
    axiosInstance({
        url: "/auth/account",
        method: 'get',
    });

export const apiForgotPassword = async (data) =>
    axiosInstance({
        url: "/auth/forgot",
        method: 'post',
        data
    });

export const apiResetPassword = async (data) =>
    axiosInstance({
        url: "/auth/reset-password",
        method: 'put',
        params: {
            token: data.token
        }, data: {
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
        }
    });

export const apiVerifyOtp = async (email, otp) =>
    axiosInstance({
        url: "auth/validate-otp",
        method: 'post',
        data: {
            email: email,
            otp: otp
        }
    });

export const apiLogout = async () =>
    axiosInstance({
        url: "/auth/logout",
        method: 'post',
        withCredentials: true,
    });


export const apiGetAllUser = async (params) =>
    axiosInstance({
        url: "/users",
        method: "get",
        params,
    });


export const apiUpdateCurrentUser = async (formData) => {
    return axiosInstance.put("/users/account", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};




export const getUserById = async (id) => {
    return axiosInstance({
        url: `/users/${id}`,
        method: 'get',
    });
}

export const apiUpdatePassword = async (data) =>
    axiosInstance({ url: "/users/update-password", method: 'put', data });



export const apiSetStatusUser = async (user) => {
    return axiosInstance({
        url: "/users/status",
        method: 'put',
        data: user
    });
};


export const apiGetLoggedInDevices = async () =>
    axiosInstance({
        url: '/users/devices',
        method: 'get',
        withCredentials: true
    });

export const apiRequestDeactivateAccount = async () =>
    axiosInstance({
        url: '/deactivate/account',
        method: 'post'
    });

export const apiDeactivateAccount = async (data) =>
    axiosInstance({
        url: '/deactivate/confirm',
        method: 'post',
        data
});