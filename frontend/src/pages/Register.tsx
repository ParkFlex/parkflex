import { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterForm } from "../components/auth/RegisterForm";
import { register } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export function Register() {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (name: string, email: string, password: string, plate: string) => {
        setErrorMessage(undefined);
        try {
            const response = await register({ name, email, password, plate });
            login(response.token, response.user);
            navigate("/parking", { state: { successMessage: "Zarejestrowano pomyślnie. Witamy!" } });
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Wystąpił nieoczekiwany błąd");
            }
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem" }}>
            <div style={{ width: "100%", maxWidth: "600px" }}>
                <RegisterForm onRegister={handleRegister} errorMessage={errorMessage} />
            </div>
        </div>
    );
}
