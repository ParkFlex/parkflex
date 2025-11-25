import type { SpotState } from "../../api/spots"

interface ParkingViewProps {
  spots: SpotState[];
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
