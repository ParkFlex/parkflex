import { useEffect, useRef, useState } from "react";
import type { SpotState } from "../api/spots";
import { getSpots } from "../api/spots";
import { ErrorBanned } from "../components/Banned";
import { ParkingGrid } from "../components/reservation/Grid";
import { Messages } from "primereact/messages";
import { usePostReservation } from "../hooks/usePostReservation";
import { DateTimeSelector } from "../components/reservation/DateTimeSelector.tsx";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import {Toolbar} from "primereact/toolbar";

export function ParkingPage() {
    const [data, setData] = useState<SpotState[]>([]);
    const [isBanned, setIsBanned] = useState(false);
    const [showParking, setShowParking] = useState(true);
    const [banDays, setBanDays] = useState(3);
    const [banReason, setBanReason] = useState(
        "przekroczenie limitu rezerwacji"
    );
    const [chargeAmount, setChargeAmount] = useState(150);

    const [selectedId, setSelectedId] = useState<number | null>(null);

    const msgs = useRef<Messages>(null);
    const { reserve } = usePostReservation();

    const handleReserve = async () => {
        if (selectedId == null) {
            msgs.current?.clear();
            msgs.current?.show([
                {
                    sticky: true,
                    severity: "warn",
                    summary: "Uwaga",
                    detail: "Najpierw wybierz miejsce.",
                    closable: false,
                },
            ]);
            return;
        }

        try {
            msgs.current?.clear();
            const startTime = selectedTime[0];
            const endTime = selectedTime[1];

            const start = new Date(selectedDay);
            start.setHours(startTime.getHours(), startTime.getMinutes(), 0);

            const durationMinutes = (endTime.getTime() - startTime.getTime()) / 60_000; // ms to minutes

            const resp = await reserve(selectedId, start, durationMinutes);

            msgs.current?.show([
                {
                    sticky: true,
                    severity: "success",
                    summary: "Sukces",
                    detail: resp.message,
                    closable: false,
                },
            ]);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Nieznany błąd";
            msgs.current?.show([
                {
                    sticky: true,
                    severity: "error",
                    summary: "Błąd",
                    detail: msg,
                    closable: false,
                },
            ]);
        }
    };

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
                            alignItems: "center",
                            width: "100%"
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

                        <Toolbar
                            style={{
                                width: "95%",
                                marginTop: "1em"
                            }}
                        start={<p> Wybrane miejsce: {selectedId ?? "brak"}</p>}
                        end={<Button
                            label="Zatwierdź"
                            onClick={handleReserve}
                            disabled={selectedId == null}
                        />}
                        />
                        <div style={{ marginTop: "12px" }}>
                        <Messages ref={msgs} />
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
