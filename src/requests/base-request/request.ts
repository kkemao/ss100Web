import axios, { AxiosRequestConfig } from "axios";
import { timeout, DEV_PROTOCOL, DEV_BASE_IP, DEV_PORT } from "./config";
import {
  FailStatusCodeInterceptor,
  SuccessStatusCodeInterceptor,
} from "./response-interceptors/status-code-interceptor";
import { IDataResType } from "./type";
export const request = axios.create({
  timeout: timeout,
  // withCredentials: true,
});
request.defaults.baseURL =
  window.systemConfig.baseUrl || "http://localhost:9998";
request.defaults.headers.common = {};
export const CancelToken = axios.CancelToken;
export const isCancel = axios.isCancel;
request.interceptors.request.use((res) => {
  const token = window.localStorage.getItem("ss100_token");
  if (token) {
    res.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return res;
});
request.interceptors.response.use(
  SuccessStatusCodeInterceptor,
  FailStatusCodeInterceptor
);

// base request
enum ERequestType {
  GET = "get",
  PUT = "put",
  POST = "post",
  DELETE = "delete",
}
const baseRequest =
  (type: ERequestType) =>
  <R = IDataResType<string>, P = {}>(url: string, params?: P) => {
    if (type === ERequestType.GET || type === ERequestType.DELETE) {
      return request[type]<R>(url).then((res) => res.data);
    }
    return request[type]<R>(url, params).then((res) => res.data);
  };

export const baseGet = baseRequest(ERequestType.GET);
export const basePost = baseRequest(ERequestType.POST);
export const baseDelete = baseRequest(ERequestType.DELETE);
