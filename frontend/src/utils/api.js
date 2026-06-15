import axios from "axios";
import store from "../store";
import { setAccessToken, logout } from "../redux/authSlice";

// ── Central Axios Instance ────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Har request mein accessToken automatically attach ho
api.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────
// 401 aaye → refresh token se naya accessToken lo → original request retry karo
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 aaya aur yeh retry nahi hai aur refresh-token route nahi hai
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        // Agar already refresh ho raha hai to queue mein daalo
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken } = store.getState().auth;

      if (!refreshToken) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        const newAccessToken = data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;