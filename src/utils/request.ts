import axios from 'axios';
import {getUserToken, logout} from "@/store/modules/user";

const Unauthorized = 401;

// 创建 axios 实例
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8888',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么，比如添加 token
        const token = getUserToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 处理请求错误
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        const resp = error.response;
        if (resp.status === Unauthorized) {
            logout(2500);
        }
        return Promise.reject(error);
    }
);

// 封装请求方法
const request = {
    get(url, params?) {
        if (params) {
            for (const key in params) {
                if (Array.isArray(params[key])) {
                    params[key] = JSON.stringify(params[key]); // 将数组转换为JSON字符串
                }
            }
        }
        return axiosInstance.get(url, {params});
    },
    post(url, data) {
        return axiosInstance.post(url, data);
    },
    put(url, data?) {
        return axiosInstance.put(url, data);
    },
    delete(url) {
        return axiosInstance.delete(url);
    },
};

export default request;
