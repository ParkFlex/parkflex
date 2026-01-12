import { Button } from "primereact/button";
import type { SpotState } from "../../api/spots";

/**
 * Właściwości komponentu Spot.
 */
export interface SpotProps {
    /** Stan miejsca parkingowego */
    state: SpotState;
    /** ID aktualnie wybranego miejsca */
    selectedId: number | null;
    /** Callback wywoływany przy wyborze miejsca */
    onSelect: (id: number) => void;
}

/**
 * Komponent reprezentujący pojedyncze miejsce parkingowe w gridzie.
 * 
 * @param props - Właściwości komponentu
 * 
 * @remarks
 * Komponent wyświetla różne typy "miejsc":
 * - **normal** - Standardowe miejsce parkingowe (przycisk z numerem)
 * - **gate** - Brama/wjazd (symbol ↓↑)
 * - **blank** - Puste pole (niewidoczne)
 * - **arrow-XX** - Strzałki kierunkowe (RD, UR, LU, DL, UP, DOWN, LEFT, RIGHT)
 * 
 * Kolory:
 * - Zajęte: #b5ccbf (szary)
 * - Wybrane: #4d7975 (ciemnozielony)
 * - Dostępne: #f8f9fa (biały)
 * 
 * @example
 * ```tsx
 * <Spot
 *   state={{ id: 42, role: "normal", occupied: false, displayOrder: 1 }}
 *   selectedId={42}
 *   onSelect={(id) => console.log('Wybrano miejsce:', id)}
 * />
 * ```
 */
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

    const SymbolTile = (p: { glyph: string, rotation?: string }) =>
        <div
            style={{
                ...baseStyle,
                fontSize: "1rem",
                backgroundColor: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                rotate: p.rotation
            }}
        >
            <span>{p.glyph}</span>
        </div>;


    function selectSpot() {
        if (occupied) {
            return;
        }
        onSelect(id);
    }

    if (role === "gate") {
        return <SymbolTile glyph="↓↑"/>;
    }

    if (role === "blank") {
        return <div style={{ ...baseStyle, visibility: "hidden" }} />;
    }

    const splited = role.split("arrow-");
    const isArrow = splited.length === 2;
    if (isArrow) {
        const direction = splited[1];

        let glyph: string | null = null;
        let rotation = undefined;
        switch (direction) {
            // Angled
            case "RD":
                glyph = "↰";
                rotation = "-90deg";
                break;
            case "UR":
                glyph = "↳";
                break;
            case "LU":
                glyph = "↳";
                rotation = "-90deg";
                break;
            case "DL":
                glyph = "↰";
                break;

            // Straight
            case "UP":
                glyph = "↑";
                break;
            case "DOWN":
                glyph = "↓";
                break;
            case "LEFT":
                glyph = "←";
                break;
            case "RIGHT":
                glyph = "→";
                break;
            default:
                return <div style={{ ...baseStyle, visibility: "hidden" }} />;
        }

        return <SymbolTile glyph={glyph} rotation={rotation}/>;
    }

    if (role == "normal")
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
