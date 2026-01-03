import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Card } from "primereact/card";

interface RegisterFormProps {
    errorMessage?: string;
    onRegister: (name: string, email: string, password: string) => void;
}

export function RegisterForm({ onRegister, errorMessage }: RegisterFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        onRegister(name, email, password);
    };

    const isFormValid =
        name.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        confirmPassword.trim() !== "" &&
        password === confirmPassword;

    const passwordsMatch = password === confirmPassword || confirmPassword === "";

    return (
        <Card className="register-form-card">
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>
                        Imię i nazwisko
                    </label>
                    <InputText
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Wpisz swoje imię i nazwisko"
                        style={{ width: "100%" }}
                        autoComplete="name"
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>
                        Email
                    </label>
                    <InputText
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Wpisz swój email"
                        style={{ width: "100%" }}
                        autoComplete="email"
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>
                        Hasło
                    </label>
                    <Password
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wpisz swoje hasło"
                        style={{ width: "100%" }}
                        inputStyle={{ width: "100%" }}
                        toggleMask
                        autoComplete="new-password"
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.5rem" }}>
                        Potwierdź hasło
                    </label>
                    <Password
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Wpisz ponownie hasło"
                        style={{ width: "100%" }}
                        inputStyle={{ width: "100%" }}
                        feedback={false}
                        toggleMask
                        autoComplete="new-password"
                    />
                    {!passwordsMatch && (
                        <small style={{ color: "#e24c4c", marginTop: "0.25rem", display: "block" }}>
                            Hasła nie są identyczne
                        </small>
                    )}
                </div>

                {errorMessage && (
                    <div
                        style={{
                            color: "#e24c4c",
                            marginBottom: "1rem",
                            padding: "0.5rem",
                            backgroundColor: "#ffe6e6",
                            borderRadius: "4px",
                            textAlign: "center"
                        }}
                    >
                        {errorMessage}
                    </div>
                )}

                <Button
                    type="submit"
                    label="Zarejestruj się"
                    icon="pi pi-user-plus"
                    style={{ width: "100%" }}
                    disabled={!isFormValid}
                />
            </form>
        </Card>
    );
}

