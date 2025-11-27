import type { SpotState } from "../../api/spots"
import {useState} from "react";
import {Button} from "primereact/button";

interface ParkingViewProps {
  spots: SpotState[];
}

export function Spot({id,occupied}: SpotState,) {
    const[color , setColor] = useState("")

    return <Button
        style={{backgroundColor: occupied ? "red" : color}}
                   onClick={() => setColor("green")}>{id}</Button>
}

export const ParkingGrid = ({ spots }: ParkingViewProps) => {
  return <div>
    {spots.length > 0 && (
      <div className="parking-data">
        {spots.map((spot, index) => (
          <div key={index}>{JSON.stringify(spot)}</div>
        ))}
      </div>
    )}
  </div>
}
