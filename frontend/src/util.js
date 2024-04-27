import axios from "axios";
import _ from "lodash";
import { mutate } from "swr";

const LOCAL_URL = "http://localhost:8000";
const PROD_URL = "http://ec2-35-90-16-29.us-west-2.compute.amazonaws.com:8000";

console.log("NODE_ENV", process.env.NODE_ENV);

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? PROD_URL : LOCAL_URL,
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
