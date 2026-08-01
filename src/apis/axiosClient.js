import axios from "axios";

const axiosClient = axios.create({
  // 호스트 루트만 담고, REST API Prefix(/api)는 각 API 호출부에서 명시한다 (0. 공통 규칙)
  baseURL: import.meta.env.VITE_PUBLIC_URL,
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
