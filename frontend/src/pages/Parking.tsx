import { useEffect, useState } from "react";
import type { SpotState } from "../api/spots";
import { getSpots } from "../api/spots";
import { ParkingGrid } from "../components/reservation/Grid";

export function ParkingPage() {
  const [data, setData] = useState<SpotState[]>([]);
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

  return (
    <div className="parking-page">
      <h1>Parking View</h1>
      <ParkingGrid spots={data} />
    </div>
  );
}
