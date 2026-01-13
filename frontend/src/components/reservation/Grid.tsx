import { Spot } from "./Spot";
import type { SpotState } from "../../models/SpotState.ts";

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
                width: "100%",
                //maxWidth: "600px",
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(10, 1fr)",
                    gap: "0.25rem",
                    border: "1px solid #b5ccbf",
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
