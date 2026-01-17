"use client";

import { useIdentityStore } from "@/store/identity.store";
import axios, { HttpStatusCode } from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const { token } = useIdentityStore.getState();
        if (token) {
            config.headers.set("Authorization", `Bearer ${token}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        const req = error.config;
        if (
            error.response?.data.status === HttpStatusCode.Unauthorized &&
            !req?._retry &&
            !req.url.includes("/authzk/refresh-token")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => axiosInstance(req));
            }
            req._retry = true;
            isRefreshing = true;

            const { refreshToken } = useIdentityStore.getState();
            try {
                await refreshToken();
                processQueue();
                return axiosInstance(req);
            } catch (err) {
                processQueue(err);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
