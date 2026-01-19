import { useState } from "react";
import { useNavigate } from "react-router";
import { RegisterForm } from "../components/auth/RegisterForm";
import { register } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import { useDocumentTitle } from "../hooks/useDocumentTitle.ts";

export function Register() {
    useDocumentTitle("Rejestracja");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRegister = async (
        name: string,
        email: string,
        password: string,
        plate: string
    ) => {
        setErrorMessage(undefined);
        try {
            const response = await register({ name, email, password, plate });
            login(response.token, response.user);
            navigate("/parking", {
                state: { successMessage: "Zarejestrowano pomyślnie." },
            });
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
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem 1rem",
                minHeight: "calc(100vh - 240px)"
            }}
        >
            <div style={{ width: "100%", maxWidth: "90%" }}>
                <RegisterForm
                    onRegister={handleRegister}
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
}
