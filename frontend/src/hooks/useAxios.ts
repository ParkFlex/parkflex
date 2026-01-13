import axios, { type AxiosInstance } from "axios";
import { useMemo } from "react";

/**
 * Tworzy prekonfigurowaną instancję Axios.
 * 
 * @returns Instancja axios z ustawionym baseURL i nagłówkami
 * @internal
 */
const createAxiosInstance = (): AxiosInstance => {
    return axios.create({
        baseURL: "/api",
        headers: {
            "Content-Type": "application/json",
        },
    });
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
