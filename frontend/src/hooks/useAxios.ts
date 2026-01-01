import axios, { type AxiosInstance } from 'axios';
import { useMemo } from 'react';

const createAxiosInstance = (): AxiosInstance => {
    return axios.create({
        baseURL: '/api',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const useAxios = (): AxiosInstance => {
    return useMemo(() => createAxiosInstance(), []);
};

