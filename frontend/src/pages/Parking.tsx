import {useEffect, useState} from "react";
import type {SpotState} from "../api/spots";
import {getSpots} from "../api/spots";
import {ParkingGrid} from "../components/reservation/Grid";
import {ErrorBanned} from "../components/Banned";

export function ParkingPage() {
    const [data, setData] = useState<SpotState[]>([]);
    const [isBanned, setIsBanned] = useState(true);
    const [showParking, setShowParking] = useState(true);
    const [banDays, setBanDays] = useState(3);
    const [banReason, setBanReason] = useState("przekroczenie limitu rezerwacji");
    const [chargeAmount, setChargeAmount] = useState(150);

    // selected spot id
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const defaultStartDate = new Date();
        const defaultEndDate = new Date();

        const callApi = async () => {
            try {
                const retrieved = await getSpots(defaultStartDate, defaultEndDate);
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
                <ParkingGrid
                    spots={data}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                />
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
