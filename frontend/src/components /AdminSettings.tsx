// Widok konfiguracji parametrów systemu (np. maksymalny czas rezerwacji, wysokość kar itd idk czy to jest przydatne szczerze).

import { useState } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export function AdminSettings() {

    const [maxTime, setMaxTime] = useState(9);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Konfiguracja Parametrów</h2>

            <Card title="Maksymalny czas" style={{ marginBottom: '20px' }}>
                <InputNumber
                    value={maxTime}
                    onValueChange={(e) => setMaxTime(e.value || 0)}
                    suffix=" h"
                />
            </Card>

            <Button label="Zapisz Zmiany" icon="pi pi-save" />
        </div>
    );
}