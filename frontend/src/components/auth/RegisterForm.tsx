import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { FormField } from "./FormField";
import { FormError } from "./FormError";

interface RegisterFormProps {
    errorMessage?: string;
    onRegister: (name: string, email: string, password: string) => void;
}

type FormErrors = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

function validateForm(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
): FormErrors {
    const errors: FormErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
        errors.name = "Imię i nazwisko jest wymagane";
    } else if (!/^\S+ \S+$/.test(trimmedName)) {
        errors.name = "Podaj imię i nazwisko (oddzielone spacją)";
    }

    if (!email.trim()) {
        errors.email = "Email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Nieprawidłowy email";
    }

    if (!password) {
        errors.password = "Hasło jest wymagane";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Potwierdź hasło";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Hasła nie są identyczne";
    }

    return errors;
}

export function RegisterForm({ onRegister, errorMessage }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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
            formData.name,
            formData.email,
            formData.password,
            formData.confirmPassword
        );
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        onRegister(formData.name, formData.email, formData.password);
    };

    return (
        <Card
            className="register-form-card"
            style={{ maxWidth: "450px", margin: "auto" }}
        >
            <form onSubmit={handleSubmit} noValidate>
                {/* Imie i nazwisko */}
                <FormField
                    label="Imię i nazwisko"
                    id="name"
                    error={errors.name}
                >
                    <InputText
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            handleInputChange("name", e.target.value)
                        }
                        placeholder="Wpisz swoje imię i nazwisko"
                        style={{ width: "100%" }}
                        // Highlight the input red if there is an error
                        className={errors.name ? "p-invalid" : ""}
                    />
                </FormField>

                {/* Email */}
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
                    />
                </FormField>

                {/* Haslo */}
                <FormField label="Hasło" id="password" error={errors.password}>
                    <Password
                        id="password"
                        value={formData.password}
                        onChange={(e) =>
                            handleInputChange("password", e.target.value)
                        }
                        placeholder="Wpisz swoje hasło"
                        style={{ width: "100%" }}
                        inputStyle={{ width: "100%" }}
                        toggleMask
                        className={errors.password ? "p-invalid" : ""}
                    />
                </FormField>

                {/* Potwierdzenie hasla */}
                <FormField
                    label="Potwierdź hasło"
                    id="confirmPassword"
                    error={errors.confirmPassword}
                >
                    <Password
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder="Wpisz ponownie hasło"
                        style={{ width: "100%" }}
                        inputStyle={{ width: "100%" }}
                        feedback={false}
                        toggleMask
                        className={errors.confirmPassword ? "p-invalid" : ""}
                    />
                </FormField>

                {/* Submit */}
                <div style={{ marginTop: "2rem" }}>
                    <Button
                        type="submit"
                        label="Zarejestruj się"
                        icon="pi pi-user-plus"
                        style={{ width: "100%" }}
                    />

                    <FormError message={errorMessage} />
                </div>
            </form>
        </Card>
    );
}
