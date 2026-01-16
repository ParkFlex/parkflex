import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { FormField } from "./FormField";
import { FormError } from "./FormError";

interface LoginFormProps {
    errorMessage?: string;
    onLogin: (email: string, password: string) => void;
}

type FormErrors = {
    email?: string;
    password?: string;
};

function validateForm(email: string, password: string): FormErrors {
    const errors: FormErrors = {};

    if (!email.trim()) {
        errors.email = "Email jest wymagany";
    }

    if (!password) {
        errors.password = "Hasło jest wymagane";
    }

    return errors;
}

export function LoginForm({ onLogin, errorMessage }: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(
            formData.email,
            formData.password
        );
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        onLogin(formData.email, formData.password);
    };

    return (
        <Card
            className="login-form-card"
            style={{ maxWidth: "450px", margin: "auto" }}
        >
            <form onSubmit={handleSubmit} noValidate>
                <FormField label="Email" id="email" error={errors.email}>
                    <InputText
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                        placeholder="Wpisz swój email"
                        style={{ width: "100%" }}
                        className={errors.email ? "p-invalid" : ""}
                        autoComplete="email"
                    />
                </FormField>

                <FormField label="Hasło" id="password" error={errors.password}>
                    <Password
                        id="password"
                        value={formData.password}
                        onChange={(e) =>
                            handleInputChange("password", e.target.value)
                        }
                        placeholder="Wpisz swoje hasło"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            alignItems: "center",
                        }}
                        inputStyle={{ width: "100%", boxSizing: "border-box" }}
                        toggleMask
                        feedback={false}
                        className={errors.password ? "p-invalid" : ""}
                        autoComplete="current-password"
                    />
                </FormField>

                <div style={{ marginTop: "2rem" }}>
                    <Button
                        type="submit"
                        label="Zaloguj się"
                        icon="pi pi-sign-in"
                        style={{ width: "100%" }}
                    />

                    <FormError message={errorMessage} />
                </div>
            </form>
        </Card>
    );
}
