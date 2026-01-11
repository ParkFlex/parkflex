import { useState } from "react"; // żeby strona pamiętała co wpisaliśmy
import { SingleParameterCard } from "../components/SingleParameterCard";

export function AdminParameters() { // główna funkcja strony
    const morski = '#5c7e7b';
    const jasnaZielen = '#d9e2db';

    const [overtimePenalty, setOvertimePenalty] = useState(150); // kara za każde 15 min
    const [wrongSpotPenalty, setWrongSpotPenalty] = useState(500); // kara za złe miejsce
    const [minTime, setMinTime] = useState(30); // minimalny czas
    const [maxTime, setMaxTime] = useState(720); // maksymalny czas
    const [banDuration, setBanDuration] = useState(7); // długość bana w dniach
    const [gapBetweenReservations, setGapBetweenReservations] = useState(15); // długość bana w dniach

    function save(name: string, value: any) { // funkcja zapisu -alert
        alert("Zapisano: " + name + " na " + value);
    }

    return(
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: morski, borderBottom: '2px solid ' + jasnaZielen }}>Ustawienia Systemowe</h2>

            <div style={{ marginTop: '30px' }}>
                <SingleParameterCard
                    label="Kara za przekroczony czas postoju"
                    description="Wysokość kary naliczana co 15 min"
                    value={overtimePenalty}
                    onChange={setOvertimePenalty}
                    onSave={function() { save("Kara 15min", overtimePenalty); }}
                    mode="currency"
                />

                <SingleParameterCard
                    label="Kara za niewłaściwe miejsce parkingowe"
                    description="Wysokość kary za zajęcie niewłaściwego miejsca parkingowego"
                    value={wrongSpotPenalty}
                    onChange={setWrongSpotPenalty}
                    onSave={function() { save("Kara miejsce", wrongSpotPenalty); }}
                    mode="currency"
                />

                <SingleParameterCard
                    label="Minimalny czas rezerwacji"
                    description="Najkrótszy możliwy czas rezerwacji"
                    value={minTime}
                    onChange={setMinTime}
                    onSave={function() { save("Min czas", minTime); }}
                    suffix=" min"
                />

                <SingleParameterCard
                    label="Maksymalny czas rezerwacji"
                    description="Najdłuższy możliwy czas rezerwacji"
                    value={maxTime}
                    onChange={setMaxTime}
                    onSave={function() { save("Max czas", maxTime); }}
                    suffix=" min"
                />

                <SingleParameterCard
                    label="Długość trwania banu"
                    description="Czas trwania blokady użytkownika"
                    value={banDuration}
                    onChange={setBanDuration}
                    onSave={function() { save("Ban", banDuration); }}
                    suffix=" dni"
                />

                <SingleParameterCard
                    label="Czas pomiedzy ponową możliwością rezerwacji"
                    description="Odstęp czasowy po jakim użytkownik może dokonać nowej rezerwacji miejsca uprzednio zajętego"
                    value={gapBetweenReservations}
                    onChange={setGapBetweenReservations}
                    onSave={function() { save("Cancelling", gapBetweenReservations); }}
                    suffix=" min"
                />
            </div>
        </div>
    );
}