import type { SpotState } from "../../api/spots"
import {Button} from "primereact/button";
import type { SpotProps } from "../../api/spots";


export function Spot({ id, occupied, selectedId, onSelect }: SpotProps) {
    const isSelected = selectedId === id;
    const color = occupied ? "#eb2338" : (isSelected ? "#47d147" : undefined);

    function SelectSpot() {
        if (!occupied){
            return onSelect(id);
        }
    }

    return (
        <Button
            style={{
                backgroundColor: color,
                justifyContent: "center",
            }}
            onClick={SelectSpot}>
            {id}
        </Button>
    );
}

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
