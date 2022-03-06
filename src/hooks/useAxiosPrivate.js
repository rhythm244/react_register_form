import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    //เข้า charge เวลา มี request เข้ามา
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    //เข้า charge เวลา มี response เข้ามา
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response, //ถ้า response ok ก็ return response ไป
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response.status === 403 && !prevRequest?.sent) {
          //case token expire
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    //axios interceptor มันจะไม่ลบตัวเอง เราต้อง cleanup ทุกครั้ง ไม่งั้นมันจะงอกออกมาเรื่อยๆ
    return () => {
      axiosPrivate.interceptors.response.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
