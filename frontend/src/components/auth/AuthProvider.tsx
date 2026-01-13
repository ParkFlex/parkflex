import { useEffect, useState, type ReactNode } from "react";
import { clearJwt, getJwtToken, setJwtToken } from "../../api/auth";
import {
    AuthContext,
    type AuthContextType,
    type User,
} from "../../hooks/useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = getJwtToken();
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse stored user data:", error);
                clearJwt();
            }
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        setJwtToken(newToken);

        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        clearJwt();

        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const setUserInContext = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        setUser: setUserInContext,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
