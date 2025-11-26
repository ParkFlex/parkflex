import axios, { type AxiosInstance } from 'axios';
import { useMemo } from 'react';

const createAxiosInstance = (): AxiosInstance => {
    return axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const useAxios = (): AxiosInstance => {
    return useMemo(() => createAxiosInstance(), []);
};

