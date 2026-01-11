import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import { FormField } from "./FormField";
import { FormError } from "./FormError";
import { isPlateValid, normalizePlate } from "../../utils/plateUtils";

interface RegisterFormProps {
    errorMessage?: string;
    onRegister: (
        name: string,
        email: string,
        password: string,
        plate: string
    ) => Promise<void>;
}

type FormErrors = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    plate?: string;
};

function validateForm(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    plate: string
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

    const normalizedPlate = normalizePlate(plate);
    if (!normalizedPlate) {
        errors.plate = "Tablica rejestracyjna jest wymagana";
    } else if (!isPlateValid(normalizedPlate)) {
        errors.plate = "Nieprawidłowy format tablicy rejestracyjnej";
    }

    return errors;
}

export function RegisterForm({ onRegister, errorMessage }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        plate: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        if (field === "plate") {
            value = value
                .trim()
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "");
        }
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm(
            formData.name,
            formData.email,
            formData.password,
            formData.confirmPassword,
            formData.plate
        );
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setIsSubmitting(true);
            await onRegister(
                formData.name.trim(),
                formData.email.trim(),
                formData.password,
                formData.plate.trim().toUpperCase()
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card style={{ maxWidth: 540, margin: "auto", padding: "1rem" }}>
            <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
                    Utwórz konto
                </h3>

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
                        placeholder="Imię i nazwisko"
                        style={{ width: "100%" }}
                        className={errors.name ? "p-invalid" : ""}
                    />
                </FormField>

                <FormField label="Email" id="email" error={errors.email}>
                    <InputText
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                        placeholder="email@parkflex.pl"
                        style={{ width: "100%" }}
                        className={errors.email ? "p-invalid" : ""}
                    />
                </FormField>

                <FormField label="Hasło" id="password" error={errors.password}>
                    <Password
                        id="password"
                        value={formData.password}
                        onChange={(e) =>
                            handleInputChange("password", e.target.value)
                        }
                        placeholder="Hasło"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            alignItems: "center",
                        }}
                        inputStyle={{ width: "100%", boxSizing: "border-box" }}
                        feedback
                        toggleMask
                        className={errors.password ? "p-invalid" : ""}
                    />
                </FormField>

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
                        placeholder="Powtórz hasło"
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            alignItems: "center",
                        }}
                        inputStyle={{ width: "100%", boxSizing: "border-box" }}
                        feedback={false}
                        toggleMask
                        className={errors.confirmPassword ? "p-invalid" : ""}
                    />
                </FormField>

                <FormField
                    label="Tablica rejestracyjna"
                    id="plate"
                    error={errors.plate}
                >
                    <InputText
                        id="plate"
                        value={formData.plate}
                        onChange={(e) =>
                            handleInputChange("plate", e.target.value)
                        }
                        placeholder="np. WPR-1234 lub WPR1234"
                        style={{ width: "100%" }}
                        className={errors.plate ? "p-invalid" : ""}
                    />
                    <small style={{ color: "#666" }}>
                        Spacje i myślniki są usuwane automatycznie.
                    </small>
                </FormField>

                {errorMessage && <FormError message={errorMessage} />}

                <div
                    style={{
                        marginTop: "1rem",
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        type="submit"
                        label={"Zarejestruj się"}
                        icon={"pi pi-user-plus"}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </Card>
    );
}
