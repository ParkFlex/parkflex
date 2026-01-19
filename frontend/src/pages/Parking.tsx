import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ErrorBanned } from "../components/Banned";
import { ParkingGrid } from "../components/reservation/Grid";
import { usePostReservation } from "../hooks/usePostReservation";
import {
    DateTimeSelector,
    type DateTimeSpan,
} from "../components/reservation/DateTimeSelector.tsx";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useGetSpots } from "../hooks/useGetSpots.tsx";
import { formatDateWeek, formatTime } from "../utils/dateUtils.ts";
import type { SpotState } from "../models/reservation/SpotState.ts";
import { usePrelude } from "../hooks/usePrelude.ts";
import { useAxios } from "../hooks/useAxios.ts";

/**
 * Komponent strony parkingu z rezerwacją miejsc.
 *
 * Główny komponent do zarządzania rezerwacjami miejsc parkingowych.
 * Umożliwia wybór miejsca, przedziału czasowego i dokonanie rezerwacji.
 *
 * @remarks
 * Funkcjonalności:
 * - Wyświetlanie siatki miejsc parkingowych
 * - Wybór dnia i godzin rezerwacji
 * - Rezerwacja wybranego miejsca
 * - Obsługa błędów i komunikatów toast
 * - Wyświetlanie stanu blokady użytkownika
 *
 * Stan komponentu:
 * - `data`: Lista dostępnych miejsc parkingowych
 * - `selectedId`: ID wybranego miejsca
 * - `selectedDayTime`: Wybrany przedział czasowy rezerwacji
 * - `isBanned`: Flaga blokady użytkownika
 *
 * @example
 * ```tsx
 * import { ParkingPage } from './pages/Parking';
 *
 * <Route path="/parking" element={<ParkingPage />} />
 * ```
 */
export function ParkingPage() {
    const [data, setData] = useState<SpotState[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const axios = useAxios();

    const msgs = useRef<Toast>(null);
    const { reserve } = usePostReservation();

    const getSpots = useGetSpots(setData, msgs);

    const location = useLocation();
    const navigate = useNavigate();

    const { prelude, getPrelude } = usePrelude();

    const handleReserve = async () => {
        if (selectedId == null) {
            msgs.current?.clear();
            msgs.current?.show([
                {
                    sticky: false,
                    life: 3000,
                    severity: "warn",
                    summary: "Uwaga",
                    detail: "Najpierw wybierz miejsce.",
                    closable: true,
                },
            ]);
            return;
        }

        try {
            msgs.current?.clear();
            const startTime = selectedDayTime.startTime;
            const endTime = selectedDayTime.endTime;

            const start = new Date(selectedDayTime.day);
            start.setHours(startTime.getHours(), startTime.getMinutes(), 0);

            const durationMinutes =
                Math.ceil((endTime.getTime() - startTime.getTime()) / 60_000); // ms to minutes

            const resp = await reserve(selectedId, start, durationMinutes);

            msgs.current?.show([
                {
                    sticky: false,
                    life: 3000,
                    severity: "success",
                    summary: "Sukces",
                    detail: resp.message,
                    closable: false,
                },
            ]);

            getSpots(
                selectedDayTime.day,
                selectedDayTime.startTime,
                selectedDayTime.endTime
            );
            setSelectedId(null);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Nieznany błąd";
            msgs.current?.show([
                {
                    sticky: false,
                    life: 3000,
                    severity: "error",
                    summary: "Błąd",
                    detail: msg,
                    closable: false,
                },
            ]);
        }
    };

    const [dateSelectorVisible, setDateSelectorVisible] = useState(false);

    const [selectedDayTime, setSelectedDayTime] = useState<DateTimeSpan>(() => {
        const start = new Date();
        start.setHours(8);

        const end = new Date(start);
        end.setHours(16);

        const day = new Date();
        day.setDate(day.getDate() + 1);

        return {
            day: day,
            startTime: start,
            endTime: end,
        };
    });

    useEffect(() => {
        getSpots(
            selectedDayTime.day,
            selectedDayTime.startTime,
            selectedDayTime.endTime
        );
    }, [getSpots, selectedDayTime]);

    useEffect(() => {
        if (selectedId != null && data.find(el => el.id == selectedId)?.occupied)
            setSelectedId(null);
    }, [data]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msg = (location.state as any)?.successMessage;
        if (msg) {
            msgs.current?.clear();
            msgs.current?.show([
                {
                    sticky: false,
                    severity: "success",
                    summary: "Sukces",
                    detail: msg,
                    life: 3000,
                    closable: true,
                },
            ]);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, msgs, navigate]);

    return (
        <div className="parking-page">
            <style>{`
                @media (max-width: 768px) {
                    .parking-footer-content {
                        flex-direction: column !important;
                        gap: 0.75rem !important;
                    }
                    .parking-footer-data {
                        flex-direction: column !important;
                        gap: 0.5rem !important;
                        align-items: flex-start !important;
                        font-size: 0.85rem !important;
                        width: 100%;
                    }
                    .parking-footer-separator {
                        display: none !important;
                    }
                    .parking-footer-button {
                        width: 100% !important;
                    }
                }
            `}</style>
            {prelude.penaltyInformation ? (
                <ErrorBanned
                    due={prelude.penaltyInformation?.due}
                    reason={prelude.penaltyInformation.reason}
                    charge={prelude.penaltyInformation.fine}
                    onPay={() => {
                        axios.post("/payment").then(getPrelude);
                    }}
                    onWait={() => {
                        alert("wait");
                    }}
                />
            ) : (
                <div
                    style={{
                        padding: "2rem 1rem",
                        maxWidth: "95%",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        paddingBottom: "8rem"
                    }}
                >
                    <DateTimeSelector
                        visible={dateSelectorVisible}
                        setVisible={setDateSelectorVisible}
                        dayTime={selectedDayTime}
                        setDayTime={setSelectedDayTime}
                        minTime={prelude.minReservationTime}
                        maxTime={prelude.maxReservationTime}
                    />

                    <Button
                        label="Wybierz date"
                        onClick={() => setDateSelectorVisible(true)}
                        style={{ width: '100%' }}
                    />

                    <Divider/>

                    <ParkingGrid
                        spots={data}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                    />

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100vw",
                            paddingTop: "1rem",
                            paddingBottom: "1rem",
                            borderTop: "1px solid #e5e5e5",
                            backgroundColor: "#fafafa",
                            paddingLeft: "1rem",
                            paddingRight: "1rem",
                            position: "fixed",
                            bottom: "0",
                            left: "0",
                            boxShadow: "0 -1px 6px rgba(0, 0, 0, 0.03)",
                            gap: "0.75rem",
                        }}
                    >
                        <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Podsumowanie
                        </div>
                        <div style={{ 
                            display: "flex", 
                            gap: "1.5rem", 
                            alignItems: "center", 
                            fontSize: "0.95rem", 
                            width: "100%", 
                            justifyContent: "space-between",
                        }} className="parking-footer-content">
                            <div style={{ 
                                display: "flex", 
                                gap: "1.5rem", 
                                alignItems: "center",
                                flexWrap: "wrap"
                            }} className="parking-footer-data">
                                <span>Miejsce: <strong>{selectedId ?? "—"}</strong></span>
                                <span style={{ color: "#999" }} className="parking-footer-separator">•</span>
                                <span>{formatDateWeek(selectedDayTime.day)}</span>
                                <span style={{ color: "#999" }} className="parking-footer-separator">•</span>
                                <span>{formatTime(selectedDayTime.startTime)}–{formatTime(selectedDayTime.endTime)}</span>
                            </div>
                            <Button
                                label="Zatwierdź"
                                onClick={handleReserve}
                                disabled={selectedId == null}
                                size="small"
                                className="parking-footer-button"
                                style={{ width: "auto" }}
                            />
                        </div>
                        <Toast position="bottom-center" ref={msgs}/>
                    </div>
                </div>
            )}
        </div>
    );
}
