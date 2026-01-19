import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { Navigate, useLocation } from "react-router";

export const Unprotected = ({ children }: { children: ReactNode }): ReactNode => {
    const authCtx = useAuth();
    const location = useLocation();

    const bounceBack = location?.state?.protected || "/parking";

    return authCtx.isAuthenticated
        ? <Navigate to={bounceBack} />
        : children;
};
