import { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterForm } from "../components/auth/RegisterForm";
import { register } from "../api/auth";
import { useAuth } from "../components/auth/AuthContext";

export function Register() {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (
        name: string,
        email: string,
        password: string
    ) => {
        setErrorMessage(undefined);

        try {
            const response = await register({ name, email, password });
            login(response.token, response.user);

            navigate("/parking");
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
            className="register-page"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: "1rem",
                backgroundColor: "#f5f5f5",
            }}
        >
            <div style={{ width: "100%", maxWidth: "400px" }}>
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "2rem",
                    }}
                >
                    <p style={{ color: "#666" }}>Utwórz nowe konto</p>
                </div>

                <RegisterForm
                    onRegister={handleRegister}
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
}
