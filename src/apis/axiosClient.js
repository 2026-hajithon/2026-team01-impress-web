import axios from "axios";

const axiosClient = axios.create({
  // 호스트 루트만 담고, REST API Prefix(/api)는 각 API 호출부에서 명시한다 (0. 공통 규칙)
  baseURL: import.meta.env.VITE_PUBLIC_URL,
  headers: { "Content-Type": "application/json" },
});

// 개발 환경에서만 모든 REST 요청/응답을 콘솔에 남긴다.
if (import.meta.env.DEV) {
  axiosClient.interceptors.request.use((config) => {
    console.log(
      `%c[REST →] ${config.method?.toUpperCase()} ${config.url}`,
      "color:#6991ff",
      { params: config.params, data: config.data, headers: config.headers },
    );
    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => {
      console.log(
        `%c[REST ←] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        "color:#3ec98b",
        response.data,
      );
      return response;
    },
    (error) => {
      console.error(
        `%c[REST ✕] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        "color:#ff3b9b",
        { status: error.response?.status, data: error.response?.data, message: error.message },
      );
      return Promise.reject(error);
    },
  );
}

export default axiosClient;
