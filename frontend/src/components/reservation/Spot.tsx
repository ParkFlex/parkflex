import { Button } from "primereact/button";
import type { SpotState } from "../../api/spots";

export interface SpotProps {
    state: SpotState;
    selectedId: number | null;
    onSelect: (id: number) => void;
}

export function Spot({ state, selectedId, onSelect }: SpotProps) {
    const { id, occupied, role } = state;
    const isSelected = selectedId === id;
    const color = occupied ? "#eb2338" : isSelected ? "#47d147" : undefined;

    function selectSpot() {
        if (occupied) {
            return;
        }

        onSelect(id);
    }

    if (role === "gate") {
        return (
            <Button
                style={{
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "clamp(10px, 2vw, 14px)",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                    border: "none",
                }}
                disabled
            >
                Brama wjazdowa
            </Button>
        );
    }

    if (role === "blank") {
        return (
            <Button
                style={{
                    opacity: 0,
                    pointerEvents: "none",
                }}
                disabled
            />
        );
    }

    // Render normal parking spot
    return (
        <Button
            style={{
                backgroundColor: color,
                justifyContent: "center",
                fontSize: "clamp(12px, 2.5vw, 16px)",
            }}
            onClick={selectSpot}
        >
            {id}
        </Button>
    );
}
