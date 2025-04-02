import axios from 'axios';
import { setExpiredMessage } from '@/store/user/userSlice';
import { store } from '@/store/redux';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});


axiosInstance.interceptors.request.use(function (config) {
  let localData = window.localStorage.getItem('persist:ogani_shop/user');
  if (localData && typeof localData === 'string') {
    localData = JSON.parse(localData);
    const accessToken = JSON.parse(localData?.token);
    if (accessToken && accessToken !== 'null') {
      config.headers = { authorization: `Bearer ${accessToken}` };
    }
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

let isRefreshing = false;
let refreshSubscribers = []; 

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;
      
      // Handle 403 (Forbidden/Account Locked) error
      if (error.response.status === 403) {
        // Remove token from localStorage
        window.localStorage.removeItem('persist:ogani_shop/user');
        return error.response.data
      }
      
      // Existing 401 (Unauthorized/Token Expired) handling
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!store.getState().user.isLoggedIn) {
          return Promise.reject(error);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            });

            const { access_token } = response.data.data;
            if (access_token) {
              // Cập nhật token mới vào localStorage
              let localData = JSON.parse(window.localStorage.getItem('persist:ogani_shop/user') || '{}');
              localData.token = JSON.stringify(access_token);
              window.localStorage.setItem('persist:ogani_shop/user', JSON.stringify(localData));

              // Đánh dấu đã refresh xong và gọi lại các request chờ
              isRefreshing = false;
              onRefreshed(access_token);

              // Cập nhật header của request cũ và gửi lại
              originalRequest.headers.authorization = `Bearer ${access_token}`;
              return axios(originalRequest);
            }
          } catch (err) {
            isRefreshing = false;
            window.localStorage.removeItem('persist:ogani_shop/user');
            store.dispatch(setExpiredMessage());
            return Promise.reject(err);
          }
        }

        // Nếu đang refresh, chờ token mới rồi gửi lại request
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.authorization = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }
    }
    return error.response.data
  }
);
export default axiosInstance;