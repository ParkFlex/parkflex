import { Link, useNavigate } from "react-router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useAuth } from "../hooks/useAuth";

export function Account() {
    const { user, token, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const copyToken = async () => {
        if (!token) return;
        await navigator.clipboard.writeText(token);
    };

    if (!isAuthenticated || !user) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "2rem",
                }}
            >
                <Card style={{ width: 440, textAlign: "center" }}>
                    <h3 style={{ marginTop: 0 }}>Konto</h3>
                    <p>Nie jesteś zalogowany.</p>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                            marginTop: "1rem",
                        }}
                    >
                        <Link to="/login">
                            <Button label="Zaloguj się" />
                        </Link>
                        <Link to="/register">
                            <Button
                                label="Zarejestruj się"
                                className="p-button-secondary"
                            />
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "0.75rem",
            }}
        >
            <Card style={{ width: 700, maxWidth: "95%", padding: "0.75rem" }}>
                <div
                    style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                    }}
                >
                    <Avatar
                        label={
                            user.name ? user.name.charAt(0).toUpperCase() : "U"
                        }
                        shape="circle"
                        size="large"
                        style={{
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            fontSize: "1rem",
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0 }}>{user.name}</h3>
                        <div style={{ color: "#666", fontSize: "0.95rem" }}>
                            {user.email}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.4rem",
                        }}
                    >
                        {/* Mozna dodac edytowanie tablicy rejestracyjnej */}
                        <Button
                            label="Edytuj profil"
                            icon="pi pi-user-edit"
                            className="p-button-outlined"
                            onClick={() => navigate("/account/edit")}
                            style={{ padding: "0.4rem 0.6rem" }}
                        />
                        <Button
                            label="Wyloguj"
                            icon="pi pi-sign-out"
                            className="p-button-danger"
                            onClick={() => logout()}
                            style={{ padding: "0.4rem 0.6rem" }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        borderTop: "1px solid #eee",
                        paddingTop: "0.6rem",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "130px 1fr",
                            rowGap: "0.5rem",
                            columnGap: "0.75rem",
                        }}
                    >
                        <div
                            style={{
                                color: "#444",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                            }}
                        >
                            Rola
                        </div>
                        <div style={{ color: "#333", fontSize: "0.95rem" }}>
                            {user.role}
                        </div>

                        <div
                            style={{
                                color: "#444",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                            }}
                        >
                            Tablica
                        </div>
                        <div style={{ color: "#333", fontSize: "0.95rem" }}>
                            {user.plate}
                        </div>

                        <div
                            style={{
                                color: "#444",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                            }}
                        >
                            Token
                        </div>
                        <div
                            style={{
                                color: "#333",
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                                fontSize: "0.9rem",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "monospace",
                                    wordBreak: "break-all",
                                    maxWidth: 420,
                                    color: "#666",
                                }}
                            >
                                {token ? "••••••••••••" : "Brak tokena"}
                            </div>
                            {token && (
                                <Button
                                    icon="pi pi-copy"
                                    className="p-button-text"
                                    onClick={copyToken}
                                    aria-label="Kopiuj token"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
