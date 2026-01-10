import axios from "axios";
import { createAxiosInstance } from "../hooks/useAxios";
import type { User } from "../hooks/useAuth";

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    token: string;
    user: User;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: User;
}

const MOCK_REGISTER_RESPONSE = true;

const MOCK_LOGIN_RESPONSE = true;

export const login = async ({
    email,
    password,
}: LoginRequest): Promise<LoginResponse> => {
    if (MOCK_LOGIN_RESPONSE) {
        return new Promise<LoginResponse>((resolve, reject) => {
            setTimeout(() => {
                if (!email || !password) {
                    reject(new Error("Email i hasło są wymagane"));
                    return;
                }

                resolve({
                    token: "mock-jwt",
                    user: {
                        id: 1,
                        name: "Mock User",
                        email,
                        role: "user",
                    },
                });
            }, 600);
        });
    }

    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.post<LoginResponse>("/login", {
            email,
            password,
        });

        return response.data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data?.message || "Błąd logowania");
        }

        throw new Error("Wystąpił nieoczekiwany błąd");
    }
};
export const register = async ({
    name,
    email,
    password,
}: RegisterRequest): Promise<RegisterResponse> => {
    if (MOCK_REGISTER_RESPONSE) {
        return new Promise<RegisterResponse>((resolve) => {
            setTimeout(() => {
                resolve({
                    token: "mock-jwt",
                    user: {
                        id: 1,
                        name,
                        email,
                        role: "user",
                    },
                });
            }, 1000);
        });
    }

    const axiosInstance = createAxiosInstance();

    try {
        const response = await axiosInstance.post<RegisterResponse>(
            "/register",
            {
                name,
                email,
                password,
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
