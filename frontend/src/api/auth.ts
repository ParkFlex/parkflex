import axios from "axios";
import { createAxiosInstance } from "../hooks/useAxios";
import type { User } from "../hooks/useAuth";

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    plate: string;
}

interface RegisterResponse {
    token: string;
    user: User;
}

interface PatchAccountRequest {
    plate?: string;
}

export const register = async ({
    name,
    email,
    password,
    plate,
}: RegisterRequest): Promise<RegisterResponse> => {
    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.post<RegisterResponse>(
            "/register",
            {
                name,
                email,
                password,
                plate,
            }
        );

        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data?.message || "Błąd rejestracji");
        }

        throw new Error("Wystąpił nieoczekiwany błąd");
    }
};

export const clearJwt = (): void => {
    localStorage.removeItem("jwt");
    console.log("Logged out, jwt removed from localStorage");
};

export const getJwtToken = (): string | null => {
    return localStorage.getItem("jwt");
};

export const setJwtToken = (token: string): void => {
    localStorage.setItem("jwt", token);
};

export const patchAccount = async (data: { plate?: string }) => {
    const axiosInstance = createAxiosInstance();
    try {
        const response = await axiosInstance.patch<PatchAccountRequest>(
            "/account",
            data
        );
        return response.data as User;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(
                err.response?.data?.message || "Błąd aktualizacji konta"
            );
        }
        throw new Error("Wystąpił nieoczekiwany błąd");
    }
};
