import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://www.example.com/api",
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
