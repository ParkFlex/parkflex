import { useState, useEffect, useRef } from "react";
import { SingleParameterCard } from "../components/SingleParameterCard";
import { useAxios } from "../hooks/useAxios"; // komponent do obsługi axios z tokenem
import { Toast } from 'primereact/toast';

export function AdminParameters() {
    const morski = '#5c7e7b';
    const jasnaZielen = '#d9e2db';
    const axios = useAxios(); // uzycie hooka do uzyskania instancji axios z tokenem
    const toast = useRef<Toast>(null);

    const [overtimePenalty, setOvertimePenalty] = useState(0);// Inicjalizacja stanu dla kary za przekroczenie czasu
    const [wrongSpotPenalty, setWrongSpotPenalty] = useState(0); // Inicjalizacja stanu dla kary za niewłaściwe miejsce
    const [minTime, setMinTime] = useState(0); // Inicjalizacja stanu dla minimalnego czasu rezerwacji
    const [maxTime, setMaxTime] = useState(0); // Inicjalizacja stanu dla maksymalnego czasu rezerwacji
    const [banDuration, setBanDuration] = useState(0); // Inicjalizacja stanu dla długości trwania bana
    const [gap, setGap] = useState(0); // Inicjalizacja stanu dla czasu pomiędzy rezerwacjami

    useEffect(() => {
        axios.get("parameter/all") // Pobieranie wszystkich parametrów z backendu
            .then((response: any) => {
                const data = response.data;
                console.log("Pobrane parametry z backendu:", data);

                data.forEach((p: any) => {
                    // Switch case zgodnie z sugestią Karoli
                    switch (p.key) { // Sprawdzanie klucza parametru
                        case "penalty/fine/overtime": setOvertimePenalty(Number(p.value)); break; // Ustawanie stanu na podstawie wartości z backendu
                        case "penalty/fine/wrongSpot": setWrongSpotPenalty(Number(p.value)); break; // Ustawianie stanu na podstawie wartości z backendu
                        case "penalty/block/duration": setBanDuration(Number(p.value)); break; // itd itp
                        case "reservation/duration/min": setMinTime(Number(p.value)); break;
                        case "reservation/duration/max": setMaxTime(Number(p.value)); break;
                        case "reservation/break/duration": setGap(Number(p.value)); break;
                    }
                });
            })
            .catch((err: any) => { // Obsługa błędów
                console.error("Błąd pobierania danych:", err);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Błąd połączenia', // Tytuł tościa
                    detail: 'Nie udało się pobrać ustawień z serwera' // Treść tościa :D
                });
            });
    }, [axios]);

    function save(key: string, value: any, label?: string) { // Funkcja do zapisywania zmian parametrów ,znak zapytani - wartość opcjonalna etykieta
        axios.patch(`parameter/${key}`, { value: String(value) }) // Wysyłanie żądania PATCH do backendu z nową wartością
            .then(() => {
                toast.current?.show({ // Pokazywanie tościa po udanym zapisie
                    severity: 'success', // Poziom
                    summary: 'Zapisano', // Tytuł
                    detail: `Zaktualizowano parametr`  // Treść
                });
            })
            .catch((err: any) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Błąd zapisu',
                    detail: `Brak mozliwości aktualizacji parametru`
                });
            });
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Toast ref={toast} position={"bottom-center"}/> {/* tościk */}

            <h2 style={{ color: morski, borderBottom: '2px solid ' + jasnaZielen, paddingBottom: '10px' }}>
                Ustawienia Systemowe
            </h2>

            <div style={{ marginTop: '30px' }}>
                <SingleParameterCard // komponent karty pojedynczego parametru ,znajduje się w folderze components , ściezka: ../components/SingleParameterCard.tsx
                    label="Kara za przekroczony czas postoju"
                    description="Wysokość kary naliczana co 15 min"
                    value={overtimePenalty} // wartość parametru
                    onChange={setOvertimePenalty} // funkcja do zmiany
                    onSave={() => save("penalty/fine/overtime", overtimePenalty, "Kara za przekroczony czas postoju")} // funkcja do zapisu
                    mode="currency" // tryb walutowy
                />

                <SingleParameterCard
                    label="Kara za niewłaściwe miejsce parkingowe"
                    description="Wysokość kary za zajęcie nieprzypisanego miejsca"
                    value={wrongSpotPenalty}
                    onChange={setWrongSpotPenalty}
                    onSave={() => save("penalty/fine/wrongSpot", wrongSpotPenalty, "Kara za niewłaściwe miejsce parkingowe")}
                    mode="currency"
                />

                <SingleParameterCard
                    label="Minimalny czas rezerwacji"
                    description="Najkrótszy możliwy czas trwania rezerwacji"
                    value={minTime/60}
                    onChange={(godz:number)=>setMinTime(godz*60)}
                    onSave={() => save("reservation/duration/min", minTime, "Minimalny czas rezerwacji")}
                    suffix=" godz" // jednostka czasu
                />

                <SingleParameterCard
                    label="Maksymalny czas rezerwacji"
                    description="Najdłuższy możliwy czas trwania rezerwacji"
                    value={maxTime/60}
                    onChange={(godz:number)=>setMaxTime(godz*60)}
                    onSave={() => save("reservation/duration/max", maxTime, "Maksymalny czas rezerwacji")}
                    suffix=" godz"
                />

                <SingleParameterCard
                    label="Długość trwania bana"
                    description="Czas trwania blokady użytkownika w dniach"
                    value={banDuration/24}
                    onChange={(days: number) => setBanDuration(days * 24)}
                    onSave={() => save("penalty/block/duration", banDuration , "Długość trwania bana")}
                    suffix=" dni" // jednostka czasu w dniach
                />

                <SingleParameterCard
                    label="Czas pomiędzy rezerwacjami"
                    description="Odstęp po jakim można ponownie zarezerwować miejsce"
                    value={gap}
                    onChange={setGap}
                    onSave={() => save("reservation/break/duration", gap, "Czas pomiędzy rezerwacjami")}
                    suffix=" min"
                />
            </div>
        </div>
    );
}