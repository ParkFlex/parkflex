import { Button } from "primereact/button";
import type { SpotState } from "../../api/spots";
import { Spot } from "./Spot";
import { DateTimeDialog } from "../DateTimeDialog";

interface ParkingViewProps {
    spots: SpotState[];
    selectedId: number | null;
    setSelectedId: (x: number | null) => void;
}

export const ParkingGrid = ({
    spots,
    selectedId,
    setSelectedId,
}: ParkingViewProps) => {
    return (
        <div
            style={{
                width: "90%",
                maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gap: "4px",
                    border: "2px solid #000",
                    borderRadius: "8px",
                    padding: "8px",
                    width: "100%",
                }}
            >
                {spots.map((spot, index) => (
                    <div
                        key={spot.id || index}
                        style={{
                            width: "100%",
                            aspectRatio: "1 / 1.7",
                        }}
                    >
                        <Spot
                            state={spot}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};
