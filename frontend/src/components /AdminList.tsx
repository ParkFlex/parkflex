// Widok zarządzania listą użytkowników (tabela)

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useState } from "react";

export function AdminList() {

    const [userCount] = useState(0);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Lista Użytkowników</h2>

            <Card title="Podgląd Statusu" style={{ marginBottom: '20px' }}>
                <p>Aktualna liczba użytkowników: {userCount} (TODO: Wczytać z serwera)</p>
            </Card>

            <Button
                label="Przejdź do Tabeli Użytkowników (TODO)"
                icon="pi pi-table"
                severity="info"
            />
        </div>
    );
}