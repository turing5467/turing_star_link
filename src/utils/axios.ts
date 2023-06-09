import axios, { type AxiosRequestConfig } from 'axios';
import { getToken } from '@/utils/cookie'
// type Config = AxiosRequestConfig & {
//     loadingText: string;
//     errorText: string;
// }
enum HttpCode {
    UnAuthorized = 401
}
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000
});
instance.interceptors.request.use(config => {
    config.headers.set('Authorization', 'Bearer ' + getToken())
    // config.loadingText !== undefined && message.loading(config.loadingText, 0);
    return config;
  })

  instance.interceptors.response.use(response => {
    return response.data
  }, error => {
    if (error.response.data?.code === HttpCode.UnAuthorized) {
      if (!window.location.href.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  })

export function request(config: AxiosRequestConfig<any>){
    //请求本身返回的是一个Promise，方便异步操作
    return instance(config);
}