import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { Navigate } from "react-router";

export const Unprotected = ({ children }: { children: ReactNode }): ReactNode => {
    const authCtx = useAuth();

    return authCtx.isAuthenticated
        ? <Navigate to="/parking"/>
        : children;
};
