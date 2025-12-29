import { useEffect, useRef, useState } from "react";
import type { SpotState } from "../api/spots";
import { getSpots } from "../api/spots";
import { ParkingGrid } from "../components/reservation/Grid";
import { ErrorBanned } from "../components/Banned";
import { Messages } from "primereact/messages";
import { postReservation } from "../hooks/postReservation";

export function ParkingPage() {
    const [data, setData] = useState<SpotState[]>([]);
    const [isBanned, setIsBanned] = useState(true);
    const [showParking, setShowParking] = useState(true);
    const [banDays, setBanDays] = useState(3);
    const [banReason, setBanReason] = useState(
        "przekroczenie limitu rezerwacji"
    );
    const [chargeAmount, setChargeAmount] = useState(150);

    const [selectedId, setSelectedId] = useState<number | null>(null);

    const msgs = useRef<Messages>(null);
    const { reserve } = postReservation();

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
            const start = new Date();
            const durationMinutes = 60;
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
                        onConfirm={handleReserve}
                        msgsRef={msgs}
                    />
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
