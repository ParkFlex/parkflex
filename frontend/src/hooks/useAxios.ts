import axios, { type AxiosInstance } from "axios";
import { useMemo } from "react";
import { getJwtToken } from "../api/auth";

/**
+ * Tworzy prekonfigurowaną instancję Axios.
+ * 
+ * @returns Instancja axios z ustawionym baseURL i nagłówkami
+ * @internal
+ */
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

/**
 * Hook zapewniający dostęp do instancji Axios dla API.
 * 
 * @returns Zmemoizowaną instancję Axios skonfigurowaną dla komunikacji z backendem
 * 
 * @remarks
 * Instancja jest tworzona tylko raz dzięki useMemo, co zapobiega
 * niepotrzebnemu tworzeniu nowych instancji przy każdym renderze.
 * 
 * Konfiguracja:
 * - baseURL: `/api`
 * - Content-Type: `application/json`
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const axios = useAxios();
 *   
 *   useEffect(() => {
 *     axios.get('/endpoint').then(...);
 *   }, [axios]);
 * }
 * ```
 */
export const useAxios = (): AxiosInstance => {
    return useMemo(() => createAxiosInstance(), []);
};
