import type { SpotState } from "../../api/spots";
import { Button } from "primereact/button";
import type { SpotProps } from "../../api/spots";
import { Messages } from "primereact/messages";
import type { RefObject } from "react";

export function Spot({ id, occupied, selectedId, onSelect }: SpotProps) {
    const isSelected = selectedId === id;
    const color = occupied ? "#eb2338" : isSelected ? "#47d147" : undefined;

    function SelectSpot() {
        if (!occupied) {
            return onSelect(id);
        }
    }

    return (
        <Button
            style={{
                backgroundColor: color,
                justifyContent: "center",
            }}
            onClick={SelectSpot}
        >
            {id}
        </Button>
    );
}

interface ParkingViewProps {
    spots: SpotState[];
    selectedId: number | null;
    setSelectedId: (x: number | null) => void;
    onConfirm: () => void;
    msgsRef: RefObject<Messages | null>;
}

export const ParkingGrid = ({
    spots,
    selectedId,
    setSelectedId,
    onConfirm,
    msgsRef,
}: ParkingViewProps) => {
    return (
        <div style={{ margin: "0 auto", width: "80%" }}>
            <div
                className="parking-spots"
                style={{
                    display: "grid",
                    width: "100%",
                    margin: "0 auto",
                    gridTemplateColumns: "auto auto auto auto",
                    gridTemplateRows: "repeat(10, 40px)", // 4 row
                    gridAutoFlow: "column",
                    gap: "10px",
                }}
            >
                {spots.length > 0 &&
                    spots.map((spot, index) => (
                        <Spot
                            key={index}
                            id={spot.id}
                            role={spot.role}
                            occupied={spot.occupied}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                        />
                    ))}
            </div>
            <div>
                <p> Wybrane miejsce: {selectedId ?? "brak"}</p>
                <Button
                    label="Zatwierdź"
                    onClick={onConfirm}
                    disabled={selectedId == null}
                />
                <div style={{ marginTop: "12px" }}>
                    <Messages ref={msgsRef} />
                </div>
            </div>
        </div>
    );
};
