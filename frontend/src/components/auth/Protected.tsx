import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth.ts";
import type { ReactNode } from "react";

export const Protected = ({ children }: { children: ReactNode }): ReactNode => {
    const location = useLocation();
    const authCtx = useAuth();

    return authCtx.isAuthenticated
        ? children
        : <Navigate replace to="/login" state={{ protected: location.pathname }}/>;
};