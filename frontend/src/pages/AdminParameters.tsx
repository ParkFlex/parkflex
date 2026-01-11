import { useState, useEffect } from "react";
import { SingleParameterCard } from "../components/SingleParameterCard";
import { useAxios } from "../hooks/useAxios"; // komponent do obsługi axios z tokenem

export function AdminParameters() {
    const morski = '#5c7e7b';
    const jasnaZielen = '#d9e2db';

    const axios = useAxios(); // uzycie hooka do uzyskania instancji axios z tokenem

    const [overtimePenalty, setOvertimePenalty] = useState(0); // Inicjalizacja stanu dla kary za przekroczenie czasu
    const [wrongSpotPenalty, setWrongSpotPenalty] = useState(0); // Inicjalizacja stanu dla kary za niewłaściwe miejsce
    const [minTime, setMinTime] = useState(0); // Inicjalizacja stanu dla minimalnego czasu rezerwacji
    const [maxTime, setMaxTime] = useState(0); // Inicjalizacja stanu dla maksymalnego czasu rezerwacji
    const [banDuration, setBanDuration] = useState(0); // Inicjalizacja stanu dla długości trwania bana
    const [gap, setGap] = useState(0); // Inicjalizacja stanu dla czasu pomiędzy rezerwacjami

    useEffect(() => {
        axios.get("/all") // Pobieranie wszystkich parametrów z serwera
            .then((response: any) => {
                const data = response.data; // Obsługa odpowiedzi
                data.forEach((p: any) => {
                    if (p.key === "penalty/fine/overtime") setOvertimePenalty(Number(p.value)); // Ustawianie stanow na podstawie pobranych danych
                    if (p.key === "penalty/fine/wrongSpot") setWrongSpotPenalty(Number(p.value));
                    if (p.key === "penalty/block/duration") setBanDuration(Number(p.value));
                    if (p.key === "reservation/time/min") setMinTime(Number(p.value));
                    if (p.key === "reservation/time/max") setMaxTime(Number(p.value));
                    if (p.key === "reservation/gap") setGap(Number(p.value));
                });
            })
            .catch((err: any) => console.error("Błąd pobierania danych:", err)); // Obsługa błędów jak cos
    }, [axios]);

    function save(key: string, value: any) { // Funkcja do zapisywania zmienionych parametrów
        axios.patch(`/${key}`, { value: String(value) }) // Wysyłanie żądania PATCH do serwera
            .then(() => alert(`Zapisano parametr: ${key}`)) // Powiadomienie o sukcesie
            .catch((err: any) => alert(`Błąd zapisu ${key}: ${err.message}`)); // brak sukcesow niesteyy
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: morski, borderBottom: '2px solid ' + jasnaZielen }}>Ustawienia Systemowe</h2>

            <div style={{ marginTop: '30px' }}>
                <SingleParameterCard
                    label="Kara za przekroczony czas postoju"
                    description="Wysokość kary naliczana co 15 min"
                    value={overtimePenalty}
                    onChange={setOvertimePenalty}
                    onSave={() => save("penalty/fine/overtime", overtimePenalty)} // Zapisanie zmienionego parametru, inny zapis niz ostatnio  przez wlasnie ten server
                    mode="currency"
                />

                <SingleParameterCard
                    label="Kara za niewłaściwe miejsce parkingowe"
                    description="Wysokość kary za zajęcie niewłaściwego miejsca"
                    value={wrongSpotPenalty}
                    onChange={setWrongSpotPenalty}
                    onSave={() => save("penalty/fine/wrongSpot", wrongSpotPenalty)}
                    mode="currency"
                />

                <SingleParameterCard
                    label="Minimalny czas rezerwacji"
                    description="Najkrótszy możliwy czas rezerwacji"
                    value={minTime}
                    onChange={setMinTime}
                    onSave={() => save("reservation/time/min", minTime)}
                    suffix=" min"
                />

                <SingleParameterCard
                    label="Maksymalny czas rezerwacji"
                    description="Najdłuższy możliwy czas rezerwacji"
                    value={maxTime}
                    onChange={setMaxTime}
                    onSave={() => save("reservation/time/max", maxTime)}
                    suffix=" min"
                />

                <SingleParameterCard
                    label="Długość trwania bana"
                    description="Czas trwania blokady użytkownika"
                    value={banDuration}
                    onChange={setBanDuration}
                    onSave={() => save("penalty/block/duration", banDuration)}
                    suffix=" dni"
                />

                <SingleParameterCard
                    label="Czas pomiędzy rezerwacjami"
                    description="Odstęp po jakim można znowu zarezerwować to samo miejsce"
                    value={gap}
                    onChange={setGap}
                    onSave={() => save("reservation/gap", gap)}
                    suffix=" min"
                />
            </div>
        </div>
    );
}