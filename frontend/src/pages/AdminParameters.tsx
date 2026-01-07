import { useState } from "react"; // żeby strona pamiętała co wpisaliśmy
import { InputSwitch } from "primereact/inputswitch"; //pstryczek on/off
import { Card } from "primereact/card";
import { SingleParameterCard } from "../components/SingleParameterCard";

export function AdminParameters() { // główna funkcja strony
    const morski = '#5c7e7b';
    const jasnaZielen = '#d9e2db';
    const [maxTime, setMaxTime] = useState(24); // stan dla maksymalnego czasu rezerwacji DOMYSLNE MOZNA ZMIENIC TO TAKIE PRZYKLADY
    const [price, setPrice] = useState(5); // stan dla ceny za godzinę
    const [limit, setLimit] = useState(2); // stan dla limitu rezerwacji
    const [checked, setChecked] = useState(false); // stan dla trybu serwisowego

    function save(name: string, value: any) { // funkcja zapisu -alert
        alert("Zapisano: " + name + " na " + value);
    }
    return(
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: morski, borderBottom: '2px solid ' + jasnaZielen }}>Ustawienia Systemowe</h2>

            <div style={{ marginTop: '30px' }}>
                <SingleParameterCard
                    label="Maksymalny czas rezerwacji"
                    description="Ile godzin może trwać rezerwacja"
                    value={maxTime}
                    onChange={setMaxTime}
                    onSave={function() { save("Czas", maxTime); }}
                    suffix=" h"
                />

                <SingleParameterCard // druga karta
                    label="Cena za godzinę"
                    description="Stawka za parkowanie"
                    value={price}
                    onChange={setPrice}
                    onSave={function() { save("Cena", price); }}
                    mode="currency"
                />

                <SingleParameterCard
                    label="Limit rezerwacji"
                    description="Ile aut może mieć jedna osoba"
                    value={limit}
                    onChange={setLimit}
                    onSave={function() { save("Limit", limit); }} // funkcja zapisu
                />

                <Card style={{ borderLeft: '10px solid #e6a23c' }}> // karta dla trybu serwisowego
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Tryb serwisowy</span> // tekst wyswietlany obok pstryczka
                        <InputSwitch checked={checked} onChange={function(e) { setChecked(e.value); save("Serwis", e.value); }} />
                    </div>
                </Card>
            </div>
        </div>
    );
}