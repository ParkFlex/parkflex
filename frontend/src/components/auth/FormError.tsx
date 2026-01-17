interface FormErrorProps {
    message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null;

    return (
        <small
            style={{
                color: "#e24c4c",
                display: "block",
                marginTop: "0.25rem",
                fontSize: "0.875rem",
            }}
        >
            {message}
        </small>
    );
};
