import axios from 'axios';
import { setExpiredMessage, login, logout } from '@/store/user/userSlice';
import { store } from '@/store/redux';
import { RESPONSE_STATUS } from './responseStatus';

// Create a singleton promise to handle token refresh
let refreshTokenPromise = null;
let isTokenRefreshing = false;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const getLocalToken = () => {
  try {
    const localData = window.localStorage.getItem('persist:ogani_shop/user');
    if (localData && typeof localData === 'string') {
      const parsedData = JSON.parse(localData);
      const accessToken = JSON.parse(parsedData?.token);
      return accessToken && accessToken !== 'null' ? accessToken : null;
    }
  } catch (error) {
    console.error('Error parsing token:', error);
  }
  return null;
};

const saveToken = (newToken) => {
  try {
    store.dispatch(login({ isLoggedIn: true, token: newToken }));
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const refreshAccessToken = async () => {
  try {
    if (refreshTokenPromise) {
      return refreshTokenPromise;
    }

    if (isTokenRefreshing) {
      // Nếu đang refresh, tạo promise mới để chờ
      refreshTokenPromise = new Promise((resolve, reject) => {
        // Kiểm tra mỗi 100ms
        const checkRefreshed = setInterval(() => {
          if (!isTokenRefreshing) {
            clearInterval(checkRefreshed);
            const token = getLocalToken();
            if (token) {
              resolve(token);
            } else {
              reject(new Error('Token refresh failed'));
            }
          }
        }, 100);

        // Timeout để tránh chờ vô hạn
        setTimeout(() => {
          clearInterval(checkRefreshed);
          reject(new Error('Token refresh timeout'));
        }, 10000);
      });

      return refreshTokenPromise;
    }

    // flag refresh
    isTokenRefreshing = true;

    refreshTokenPromise = axios({
      method: 'post',
      url: `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        const { accessToken } = response.data.data;
        if (accessToken) {
          saveToken(accessToken);
          return accessToken;
        }
        throw new Error('No access token received');
      })
      .finally(() => {
        isTokenRefreshing = false;
        // Reset promise after done
        setTimeout(() => {
          refreshTokenPromise = null;
        }, 1000); // Giữ promise 1 giây để tránh race condition
      });

    return refreshTokenPromise;
  } catch (error) {
    isTokenRefreshing = false;
    refreshTokenPromise = null;
    localStorage.removeItem('persist:ogani_shop/user');
    store.dispatch(setExpiredMessage());
    throw error;
  }
};

axiosInstance.interceptors.request.use(async function (config) {
  let token = getLocalToken();

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

// Xử lý response
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const resData = error.response?.data;
    if (error.response?.status === 403 && resData?.statusCode === RESPONSE_STATUS.ACCESS_DENIED) {
      store.dispatch(logout());
      store.dispatch(setExpiredMessage());
      return Promise.reject(new Error('Tài khoản đã bị vô hiệu hóa'));
    }

    // handle lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Không thấy người dùng hợp lệ, xóa token
      if (!store.getState().user.isLoggedIn || !store.getState().user.current) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        // Refresh token
        const newToken = await refreshAccessToken();
        // Thử lại request ban đầu với token mới
        if (newToken) {
          originalRequest.headers.authorization = `Bearer ${newToken}`;
          return axios(originalRequest).then(response => response.data);
        }
      } catch (err) {
        // Nếu refresh token thất bại, xóa token và dispatch action
        store.dispatch(logout());
        store.dispatch(setExpiredMessage());
        console.error('Failed to refresh token:', err);
      }
    }
    return error.response?.data || Promise.reject(error);
  }
);

export default axiosInstance;