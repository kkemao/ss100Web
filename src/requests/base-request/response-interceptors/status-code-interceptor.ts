import { AxiosResponse } from "axios";
export const SuccessStatusCodeInterceptor = (response: AxiosResponse<any>) => {
  const { data } = response;
  const { status: businessStatus } = data;
  if (businessStatus) {
    //这里是业务状态码错误的请求逻辑，一般来说我们
    if (businessStatus !== 200) {
      //业务错误时，将后台的msg当做错误信息，供前端进行展示
      return Promise.reject(new Error(data.error || data.msg));
    } else {
      //业务正确时，正常返回
      return response;
    }
  }
  //没有业务状态码，但http状态码为2xx的时候正常返回
  return response;
};

export const FailStatusCodeInterceptor = (error: any) => {
  if (error.response) {
    console.log("respoonse error in response interceptor", error);
    const { status } = error.response;
    if (status === 401) {
      // window.location.href = "/login";
      return Promise.reject(new Error("认证过期，请重新登录"));
    }
    return Promise.reject(
      new Error(
        error.response?.data?.error ||
          error.response?.data?.msg ||
          "认证过期，请重新登录"
      )
    );
  }
  return Promise.reject(error);
};
