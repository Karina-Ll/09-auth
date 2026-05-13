import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;