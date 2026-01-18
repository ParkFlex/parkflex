import { Link } from "react-router";
import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";
import { useAuth } from "../hooks/useAuth";
import { patchAccount } from "../api/auth";
import type { ApiErrorModel } from "../models/ApiErrorModel";
import { isPlateValid, normalizePlate } from "../utils/plateUtils";

export function Account() {
    const { user, setUser, token, isAuthenticated, logout } = useAuth();
    const [editingPlate, setEditingPlate] = useState(false);
    const [plateValue, setPlateValue] = useState(user?.plate ?? "");
    const [plateError, setPlateError] = useState<string | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

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

    const startEdit = () => {
        setPlateValue(user.plate ?? "");
        setPlateError(undefined);
        setEditingPlate(true);
    };

    const cancelEdit = () => {
        setEditingPlate(false);
        setPlateError(undefined);
        setPlateValue(user.plate ?? "");
    };

    const savePlate = async () => {
        const normalized = normalizePlate(plateValue);
        if (!isPlateValid(normalized)) {
            setPlateError("Nieprawidłowy format tablicy rejestracyjnej");
            return;
        }

        try {
            setIsSaving(true);
            const updated = await patchAccount({ plate: normalized });
            setUser(updated);
            setEditingPlate(false);
        } catch (e) {
            setPlateError(
                (e as ApiErrorModel).message ||
                    "Błąd serwera podczas aktualizacji"
            );
        } finally {
            setIsSaving(false);
        }
    };

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
                            flexShrink: 0,
                            minWidth: "3rem",
                            minHeight: "3rem",
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
                        <div
                            style={{
                                color: "#333",
                                fontSize: "0.95rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                            }}
                        >
                            {!editingPlate ? (
                                <>
                                    <span>{user.plate}</span>
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-text"
                                        aria-label="Edytuj tablicę"
                                        onClick={startEdit}
                                    />
                                </>
                            ) : (
                                <>
                                    <InputText
                                        value={plateValue}
                                        onChange={(e) =>
                                            setPlateValue(
                                                normalizePlate(e.target.value)
                                            )
                                        }
                                        style={{ width: 200 }}
                                    />
                                    <Button
                                        icon="pi pi-check"
                                        className="p-button-text"
                                        onClick={savePlate}
                                        disabled={isSaving}
                                        aria-label="Zapisz tablicę"
                                    />
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-text"
                                        onClick={cancelEdit}
                                        aria-label="Anuluj"
                                    />
                                    {plateError && (
                                        <div
                                            style={{
                                                color: "#c00",
                                                marginLeft: "0.5rem",
                                            }}
                                        >
                                            {plateError}
                                        </div>
                                    )}
                                </>
                            )}
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
