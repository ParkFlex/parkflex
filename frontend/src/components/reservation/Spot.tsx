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

    const baseStyle = {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        fontWeight: "bold",
        padding: "2px",
    };

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
                    ...baseStyle,
                    color: "black",
                    fontSize: "clamp(1px, 1.5vw, 12px)",
                    backgroundColor: "transparent",
                    border: "none",
                }}
                disabled
            >
                Brama
            </Button>
        );
    }

    if (role === "blank") {
        return <div style={{ ...baseStyle, visibility: "hidden" }} />;
    }

    return (
        <Button
            style={{
                ...baseStyle,
                backgroundColor: color,
                fontSize: "clamp(10px, 2vw, 16px)",
            }}
            onClick={selectSpot}
            severity={
                occupied ? "danger" : isSelected ? "success" : "secondary"
            }
            disabled={occupied}
        >
            {id}
        </Button>
    );
}
