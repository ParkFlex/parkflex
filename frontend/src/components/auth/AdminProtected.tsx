import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { Navigate } from "react-router";

export const AdminProtected = ({ children }: { children: ReactNode }): ReactNode => {
    const authCtx = useAuth();

    return authCtx.user?.role == "admin" ? children : <Navigate to="/"/>;
};
