// Widok podglądu miejsc parkingowych zawiera pole do wyboru czasu i proste karty miejsc.

import { Card } from "primereact/card";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

export function SpotMap() {

    const [date, setDate] = useState<Date | null>(new Date());

    return (
        <div style={{ padding: '20px' }}>
            <h2>Widok Miejsc (Spots)</h2>

            {/* Pole do wyboru daty/czasu (PrimeReact) */}
            <Calendar
                value={date}
                onChange={(e) => setDate(e.value as Date)}
                showTime
                placeholder="Wybierz czas"
            />

            {/* Prosta karta, tak jak w plikach Karoli*/}
            <Card title="Miejsce 1A" style={{ marginTop: '20px' }}>
                Wolne.
            </Card>

            <Button label="Sprawdź" style={{ marginTop: '20px' }} />
        </div>
    );
}