import axios, { type AxiosInstance } from "axios";
import { useMemo } from "react";
import { getJwtToken } from "../api/auth";

export const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: "/api",
        headers: {
            "Content-Type": "application/json",
        },
    });

    instance.interceptors.request.use(
        (config) => {
            const token = getJwtToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            console.error("Request error:", error);
            return Promise.reject(new Error("Problem z uwierzytelnianiem"));
        }
    );

    return instance;
};

export const useAxios = (): AxiosInstance => {
    return useMemo(() => createAxiosInstance(), []);
};
