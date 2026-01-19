import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { createAxiosInstance } from "../../hooks/useAxios";
import { LoadingPage } from "../../pages/LoadingPage";

export function AuthCheck({ children }: { children: React.ReactNode }) {
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();
    const { logout, token } = useAuth();

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const axiosInstance = createAxiosInstance();
                    await axiosInstance.get("/whoami");
                } catch (error) {
                    logout();
                    navigate("/homepage");
                }
            }
            setIsChecking(false);
        };

        validateToken();
    }, [token, logout, navigate]);

    if (isChecking) {
        return <LoadingPage />;
    }

    return <>{children}</>;
}
