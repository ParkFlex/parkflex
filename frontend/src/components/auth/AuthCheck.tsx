import { type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { createAxiosInstance } from "../../hooks/useAxios";
import { LoadingPage } from "../../pages/LoadingPage";

export function AuthCheck({ children }: { children: ReactNode }) {
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();
    const { logout, token } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const validateToken = async () => {
            if (token) {
                try {
                    const axiosInstance = createAxiosInstance();
                    await axiosInstance.get("/whoami");
                } catch {
                    if (isMounted) {
                        logout();
                        navigate("/login");
                        return;
                    }
                }
            }

            if (isMounted) {
                setIsChecking(false);
            }
        };

        void validateToken();

        return () => {
            isMounted = false;
        };
    }, [token, logout, navigate]);

    if (isChecking) {
        return <LoadingPage />;
    }

    return <>{children}</>;
}
