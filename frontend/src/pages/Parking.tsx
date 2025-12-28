import { useEffect, useState } from "react";
import type { SpotState } from "../api/spots";
import { getSpots } from "../api/spots";
import { ErrorBanned } from "../components/Banned";
import { ParkingGrid } from "../components/reservation/Grid";
import { DateTimeSelection } from "../components/DateTimeDialog/DateTimeSelection.ts";
import { DateTimeSelector } from "../components/reservation/DateTimeSelector.tsx";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Divider } from "primereact/divider";

export function ParkingPage() {
    const [data, setData] = useState<SpotState[]>([]);
    const [isBanned, setIsBanned] = useState(false);
    const [showParking, setShowParking] = useState(true);
    const [banDays, setBanDays] = useState(3);
    const [banReason, setBanReason] = useState(
        "przekroczenie limitu rezerwacji"
    );
    const [chargeAmount, setChargeAmount] = useState(150);

    // selected spot id
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [dateSelectorVisible, setDateSelectorVisible] = useState(false);

    const [selectedTime, setSelectedTime] = useState<[Date, Date]>(() => {
        const start = new Date();
        start.setHours(start.getHours() + 2);

        const end = new Date(start);
        end.setHours(start.getHours() + 2);

        return [start, end];
    });

    const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    useEffect(() => {
        const defaultStartDate = new Date();
        const defaultEndDate = new Date();

        const callApi = async () => {
            try {
                const retrieved = await getSpots(
                    defaultStartDate,
                    defaultEndDate
                );
                setData(retrieved);
            } catch {
                console.log("Failed to fetch data");
            }
        };

        void callApi();
    }, []);

    useEffect(() => {
        if (isBanned) setShowParking(false);
    }, [isBanned]);

    return (
        <div className="parking-page">
            {showParking ? (
                <>
                    <ParkingGrid
                        spots={data}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                    />

                    <Divider/>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <DateTimeSelector
                            visible={dateSelectorVisible}
                            setVisible={setDateSelectorVisible}
                            day={selectedDay}
                            setDay={setSelectedDay}
                            time={selectedTime}
                            setTime={setSelectedTime}
                        />

                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <p>
                                Wybrane miejsce: <strong>{selectedId ?? "brak"}</strong>
                            </p>
                            <Button label="Zatwierdź"/>
                        </div>

                    </div>
                </>
            ) : (
                <ErrorBanned
                    days={banDays}
                    reason={banReason}
                    charge={chargeAmount}
                    onPay={() => {
                        alert("Blokada została opłacona");
                        setIsBanned(false);
                        setShowParking(true);
                    }}
                    onWait={() => {
                        setShowParking(true);
                    }}
                />
            )}
        </div>
    );
}
