import { FormError } from "./FormError";

interface FormFieldProps {
    label: string;
    id: string;
    error?: string;
    children: React.ReactNode;
}

export const FormField = ({ label, id, error, children }: FormFieldProps) => (
    <div style={{ marginBottom: "1.5rem" }}>
        <label
            htmlFor={id}
            style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
            }}
        >
            {label}
        </label>
        {children}
        <FormError message={error} />
    </div>
);
