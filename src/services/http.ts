import axios from "axios";
import { getToken } from "./getToken";
const http = axios.create({
  baseURL: `/api`,
  timeout: 30000,
});
// Change request data/error here
http.interceptors.request.use(
  // type error
  (config: { headers: any }) => {
    const token = getToken();
    config.headers = token
      ? {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      : {
          ...config.headers,
        };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
