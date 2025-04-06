import axios from 'axios';
import { setExpiredMessage, login } from '@/store/user/userSlice';
import { store } from '@/store/redux';
import {jwtDecode} from 'jwt-decode';

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

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < (Date.now() / 1000) - 60;
  } catch (e) {
    return true;
  }
};


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
    let localDataString = localStorage.getItem('persist:ogani_shop/user');
    let localData = localDataString ? JSON.parse(localDataString) : {};
    localData.token = JSON.stringify(newToken);
    localStorage.setItem('persist:ogani_shop/user', JSON.stringify(localData));
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
        
        // Timeout sau 5 giây để tránh chờ vô hạn
        setTimeout(() => {
          clearInterval(checkRefreshed);
          reject(new Error('Token refresh timeout'));
        }, 5000);
      });
      
      return refreshTokenPromise;
    }

    // Đánh dấu đang refresh
    isTokenRefreshing = true;
    
    // Tạo promise mới
    refreshTokenPromise = axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, 
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      }
    )
    .then(response => {
      const { access_token } = response.data.data;
      if (access_token) {
        saveToken(access_token);
        return access_token;
      }
      throw new Error('No access token received');
    })
    .finally(() => {
      isTokenRefreshing = false;
      // Reset promise sau khi hoàn thành
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

// Trước khi gửi request - kiểm tra và refresh token
axiosInstance.interceptors.request.use(async function (config) {
  // Bỏ qua request refresh token để tránh vòng lặp vô hạn
  if (config.url === '/auth/refresh') {
    return config;
  }

  let token = getLocalToken();
  
  if (token && isTokenExpired(token) && store.getState().user.isLoggedIn) {
    try {
      token = await refreshAccessToken();
    } catch (error) {
      console.error('Failed to refresh token before request:', error);
    }
  }
  
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

    if (error.response?.status === 403) {
      localStorage.removeItem('persist:ogani_shop/user');
      return error.response.data;
    }

    // handle lỗi 401 (Unauthorized) - Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!store.getState().user.isLoggedIn) {
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
        console.error('Failed to refresh token:', err);
      }
    }

    return error.response?.data || Promise.reject(error);
  }
);

export default axiosInstance;