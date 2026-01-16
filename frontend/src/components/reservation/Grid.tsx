import { Spot } from "./Spot";
import type { SpotState } from "../../models/reservation/SpotState.ts";

/**
 * Właściwości komponentu ParkingGrid.
 */
interface ParkingViewProps {
    /** Lista miejsc parkingowych do wyświetlenia */
    spots: SpotState[];
    /** ID aktualnie wybranego miejsca lub null */
    selectedId: number | null;
    /** Callback do zmiany wybranego miejsca */
    setSelectedId: (x: number | null) => void;
}

/**
 * Komponent wyświetlający siatkę miejsc parkingowych.
 * 
 * @param props - Właściwości komponentu
 * 
 * @remarks
 * Tworzy responsywną siatkę 10x N (10 kolumn) z miejscami parkingowymi.
 * Każde miejsce jest reprezentowane przez komponent {@link Spot}.
 * 
 * Układ:
 * - 10 kolumn w gridzie
 * - Responsywna szerokość (100%)
 * - Proporcje miejsca: 1:1.7 (szerokość:wysokość)
 * - Gap: 0.25rem między miejscami
 * 
 * @example
 * ```tsx
 * const [spots, setSpots] = useState<SpotState[]>([...]);
 * const [selected, setSelected] = useState<number | null>(null);
 * 
 * <ParkingGrid
 *   spots={spots}
 *   selectedId={selected}
 *   setSelectedId={setSelected}
 * />
 * ```
 */
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
