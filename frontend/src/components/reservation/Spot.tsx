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
    const color = occupied ? "#b5ccbf" : isSelected ? "#4d7975" : "#f8f9fa";
    const fgColor = isSelected ? "#fff" : "#4b807b";

    const baseStyle = {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        fontWeight: "bold",
        padding: "2px",
        border: "1px solid #aac4bd",
        color: fgColor
    };

    function selectSpot() {
        if (occupied) {
            return;
        }
        onSelect(id);
    }

    if (role === "gate") {
        return (
            <div
                style={{
                    ...baseStyle,
                    fontSize: "1rem",
                    backgroundColor: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <span>↓↑</span>
            </div>
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
                fontSize: "1rem",
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
