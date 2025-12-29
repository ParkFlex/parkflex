import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { clearJwt, getJwtToken, setJwtToken } from "../../api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface User {
    id: number;
    email: string;
    name: string;
}

// mozna dodac jakis isloading aby sprawdzic czy trwa logowanie itp
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}


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

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

