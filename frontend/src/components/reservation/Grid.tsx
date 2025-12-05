import { Button } from "primereact/button";
import type { SpotState } from "../../api/spots";
import { Spot } from "./Spot";

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
        // TODO: Zmienic na primereact :)
        <div style={{ margin: "0 auto", maxWidth: "100%" }}>
            <div
                style={{
                    overflowX: "auto",
                    marginBottom: "20px",
                }}
            >
                <div
                    className="parking-spots"
                    style={{
                        display: "grid",
                        gridTemplateRows: "repeat(6, min(120px, 10vh))",
                        gridAutoFlow: "column",
                        gridAutoColumns: "min(70px, 12vw)",
                        gap: "10px",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        padding: "10px",
                        width: "fit-content",
                    }}
                >
                    {spots.length > 0 &&
                        spots.map((spot, index) => (
                            <Spot
                                key={index}
                                state={spot}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />
                        ))}
                </div>
            </div>
            <div>
                <p> Wybrane miejsce: {selectedId ?? "brak"}</p>
                <Button label="Zatwierdź" />
            </div>
        </div>
    );
};
