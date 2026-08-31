// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const accessToken =
//       localStorage.getItem("accessToken");

//     if (accessToken) {
//       config.headers.Authorization =
//         `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

interface RefreshResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * REQUEST INTERCEPTOR
 *
 * Tự gắn accessToken vào request.
 */
api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig
  ) => {
    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/*
 * Biến dùng để tránh refresh token
 * nhiều lần cùng lúc.
 */
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (
    token: string
  ) => void;

  reject: (
    error: unknown
  ) => void;
}> = [];

/*
 * Xử lý các request đang chờ
 * trong lúc refresh token.
 */
const processQueue = (
  error: unknown,
  token: string | null
) => {
  failedQueue.forEach(
    (promise) => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    }
  );

  failedQueue = [];
};

/*
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,

  async (
    error: AxiosError
  ) => {
    const originalRequest =
      error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

    /*
     * Nếu không có request
     * thì trả lỗi luôn.
     */
    if (!originalRequest) {
      return Promise.reject(
        error
      );
    }

    /*
     * Chỉ refresh khi backend
     * trả 401.
     */
    if (
      error.response
        ?.status !== 401
    ) {
      return Promise.reject(
        error
      );
    }

    /*
     * Không refresh lại chính
     * request /auth/refresh.
     *
     * Nếu refreshToken cũng hết hạn
     * thì phải logout.
     */
    if (
      originalRequest.url?.includes(
        "/auth/refresh"
      )
    ) {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";

      return Promise.reject(
        error
      );
    }

    /*
     * Request đã retry rồi mà
     * vẫn 401 -> logout.
     */
    if (
      originalRequest._retry
    ) {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";

      return Promise.reject(
        error
      );
    }

    const refreshToken =
      localStorage.getItem(
        "refreshToken"
      );

    /*
     * Không có refresh token
     * thì quay về login.
     */
    if (!refreshToken) {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";

      return Promise.reject(
        error
      );
    }

    /*
     * Nếu đang có một request khác
     * refresh token rồi thì request
     * này chờ kết quả.
     */
    if (isRefreshing) {
      return new Promise<string>(
        (resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }
      )
        .then((token) => {
          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return api(
            originalRequest
          );
        })
        .catch(
          (queueError) =>
            Promise.reject(
              queueError
            )
        );
    }

    originalRequest._retry =
      true;

    isRefreshing = true;

    try {
      /*
       * Dùng axios thường,
       * KHÔNG dùng api.
       *
       * Nếu dùng api ở đây
       * có thể interceptor gọi
       * vòng lặp.
       */
      const response =
        await axios.post<RefreshResponse>(
          `${
            import.meta.env
              .VITE_API_URL
          }/auth/refresh`,

          {
            refreshToken,
          },

          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const newAccessToken =
        response.data.data
          .accessToken;

      const newRefreshToken =
        response.data.data
          .refreshToken;

      /*
       * Lưu access token mới.
       */
      localStorage.setItem(
        "accessToken",
        newAccessToken
      );

      /*
       * Nếu backend trả refreshToken
       * mới thì cập nhật luôn.
       */
      if (newRefreshToken) {
        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        );
      }

      /*
       * Cho các request đang chờ
       * tiếp tục chạy.
       */
      processQueue(
        null,
        newAccessToken
      );

      /*
       * Gắn token mới vào
       * request bị lỗi ban đầu.
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      /*
       * Gọi lại request cũ.
       */
      return api(
        originalRequest
      );
    } catch (
      refreshError
    ) {
      processQueue(
        refreshError,
        null
      );

      /*
       * Refresh token hết hạn
       * hoặc không hợp lệ.
       */
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "refreshToken"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "/login";

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;