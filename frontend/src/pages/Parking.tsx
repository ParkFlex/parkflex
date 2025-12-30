import { useEffect, useRef, useState } from "react";
import type { SpotState } from "../api/spots";
import { ErrorBanned } from "../components/Banned";
import { ParkingGrid } from "../components/reservation/Grid";
import { usePostReservation } from "../hooks/usePostReservation";
import { DateTimeSelector } from "../components/reservation/DateTimeSelector.tsx";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import {Toolbar} from "primereact/toolbar";
import {Toast} from "primereact/toast";
import {useGetSpots} from "../hooks/useGetSpots.tsx";

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

    const msgs = useRef<Toast>(null);
    const { reserve } = usePostReservation();

    const getSpots = useGetSpots(setData, msgs);

    const handleReserve = async () => {
        if (selectedId == null) {
            msgs.current?.clear();
            msgs.current?.show([
                {
                    sticky: false,
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
                    sticky: false,
                    severity: "success",
                    summary: "Sukces",
                    detail: resp.message,
                    closable: false,
                },
            ]);

            getSpots(selectedTime[0], selectedTime[1], selectedDay);
            setSelectedId(null);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Nieznany błąd";
            msgs.current?.show([
                {
                    sticky: false,
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
        getSpots(selectedTime[0], selectedTime[1], selectedDay);
    }, [selectedDay, selectedTime]);

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
                        <Toast position="bottom-center" ref={msgs} />
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
