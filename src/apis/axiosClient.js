import axios from "axios";

const axiosClient = axios.create({
  // 호스트 루트만 담고, REST API Prefix(/api)는 각 API 호출부에서 명시한다 (0. 공통 규칙)
  baseURL: import.meta.env.VITE_PUBLIC_URL,
  headers: { "Content-Type": "application/json" },
});

// 개발 환경에서만 모든 REST 요청/응답/에러를 콘솔에 남긴다.
if (import.meta.env.DEV) {
  axiosClient.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase();
    const hasBody = config.params || config.data;

    console.log(`%c[REST →] ${method} ${config.url}`, "color:#6991ff", hasBody ? { params: config.params, data: config.data } : "");

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
      const method = error.config?.method?.toUpperCase() ?? "?";
      const url = error.config?.url ?? "?";

      if (error.response) {
        // 서버가 응답은 했지만 실패(4xx/5xx) — 한 줄 요약 + 접힌 상세.
        const serverMessage = error.response.data?.message ?? error.response.statusText;

        console.error(
          `%c[REST ✕ ${error.response.status}] ${method} ${url} — ${serverMessage}`,
          "color:#ff3b9b; font-weight:bold",
        );
        console.groupCollapsed(`[REST ✕] ${method} ${url} 상세`);
        console.log("request:", { params: error.config?.params, data: error.config?.data });
        console.log("response:", error.response.data);
        console.groupEnd();
      } else if (error.request) {
        // 요청은 나갔지만 응답을 못 받음 — 서버가 꺼져 있거나 네트워크 문제.
        console.error(
          `%c[REST ✕ 응답 없음] ${method} ${url} — 서버에 연결할 수 없어요 (${error.message})`,
          "color:#ff3b9b; font-weight:bold",
        );
      } else {
        console.error(`%c[REST ✕ 요청 실패] ${method} ${url} — ${error.message}`, "color:#ff3b9b; font-weight:bold");
      }

      return Promise.reject(error);
    },
  );
}

export default axiosClient;
