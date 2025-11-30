import { useEffect, useState } from "react";
import type { SpotState } from "../api/spots";
import { getSpots } from "../api/spots";
import { ParkingGrid } from "../components/reservation/Grid";
import { ErrorBanned } from "../components/Banned";

export function ParkingPage() {
  const [data, setData] = useState<SpotState[]>([]);
  const [isBanned, setIsBanned] = useState(true);
  const [showParking, setShowParking] = useState(true);
  const [banDays, setBanDays] = useState(3);
  const [banReason, setBanReason] = useState("przekroczenie limitu rezerwacji");
  const [chargeAmount, setChargeAmount] = useState(150);
  const defaultStartDate = new Date();
  const defaultEndDate = new Date();

  useEffect(() => {
    const callApi = async () => {
      try {
        const data = await getSpots(defaultStartDate, defaultEndDate);
        setData(data);
      } catch {
        console.log("Failed to fetch data");
      }
    };
    callApi();
  }, []);

  useEffect(() => {
    if (isBanned) setShowParking(false);
  }, [isBanned]);

  return (
    <div className="parking-page">
      {showParking ? (
        <>
          <h1>Parking View</h1> <ParkingGrid spots={data} />{" "}
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
