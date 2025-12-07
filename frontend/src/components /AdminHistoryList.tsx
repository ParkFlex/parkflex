// Widok historii rezerwacji

import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { Button } from "primereact/button";

export function AdminHistoryList() {

    const [historyEntries] = useState([]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Historia Rezerwacji</h2>

            {/* używam Card (styl Karoli) */}
            <Card title="Podgląd Historycznych Rezerwacji" style={{ marginBottom: '20px' }}>
                <DataTable
                    value={historyEntries}
                    emptyMessage="Brak historycznych rezerwacji"
                >
                </DataTable>
            </Card>

            <Button
                label="Wczytaj Pełną Historię (TODO)"
                icon="pi pi-history"
                severity="secondary"
            />
        </div>
    );
}