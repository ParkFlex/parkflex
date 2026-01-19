import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { login } from "../api/auth";
import { LoginForm } from "../components/auth/LoginForm";
import { useDocumentTitle } from "../hooks/useDocumentTitle.ts";

export function Login() {
    useDocumentTitle("Logowanie");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const navigate = useNavigate();
    const location = useLocation();
    const { login: setAuth } = useAuth();

    const handleLogin = async (email: string, password: string) => {
        setErrorMessage(undefined);

        try {
            const response = await login({ email, password });
            setAuth(response.token, response.user);
            navigate(location.state?.path || "/parking");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Wystąpił nieoczekiwany błąd");
            }
        }
    };

    return (
        <div
            className="login-page"
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem 1rem",
                minHeight: "calc(100vh - 240px)"
            }}
        >
            <div style={{ width: "100%", maxWidth: "90%" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <p style={{ color: "#666" }}>Zaloguj się do konta</p>
                </div>

                <LoginForm onLogin={handleLogin} errorMessage={errorMessage} />

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                    <small style={{ color: "#666" }}>
                        Nie masz konta?{" "}
                        <Link to="/register">Zarejestruj się</Link>
                    </small>
                </div>
            </div>
        </div>
    );
}
