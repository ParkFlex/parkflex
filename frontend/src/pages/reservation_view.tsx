import { useEffect, useState } from "react"
import { getSpots } from "../api/spots"
import type { SpotState } from "../api/spots";
import { ReservationGrid } from "../components/reservation/grid";

export const ParkingPage = () => {
    const [data, setData] = useState<SpotState[]>([]);
    const defaultStartDate = new Date();
    const defaultEndDate = new Date();
    useEffect(() => {
        const callApi = async () => {
            try {
                const data = await getSpots(defaultStartDate, defaultEndDate)
                setData(data)
            } catch {
                console.log("Failed to fetch data")
            }
        }
        callApi()
    }, [])

    return <div>
        tutaj bedzie wyglad parkingu
        {data.map(d => {
            return JSON.stringify(d)
        })}
        <ReservationGrid />
    </div>
}
