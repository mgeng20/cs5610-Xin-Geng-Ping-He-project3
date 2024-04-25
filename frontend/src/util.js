import axios from "axios";
import _ from "lodash";
import { mutate } from "swr";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export function clearPasswordListCache() {
  mutate((key) => {
    if (_.isArray(key) && key[0] === "password-list") {
      return true;
    }
    return false;
  });
}
