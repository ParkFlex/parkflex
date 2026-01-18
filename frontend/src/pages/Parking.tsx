import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ErrorBanned } from "../components/Banned";
import { ParkingGrid } from "../components/reservation/Grid";
import { usePostReservation } from "../hooks/usePostReservation";
import type { DateTimeSpan } from "../components/reservation/DateTimeSelector.tsx";
import { DateTimeDialog } from "../components/DateTimeDialog/DateTimeDialog";
import { DateTimeSelection } from "../components/DateTimeDialog/DateTimeSelection";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { useGetSpots } from "../hooks/useGetSpots.tsx";
import { useAxios } from "../hooks/useAxios.ts";
import { formatDateWeek, formatTime } from "../utils/dateUtils.ts";
import type { SpotState } from "../models/reservation/SpotState.ts";

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
    const [isBanned, setIsBanned] = useState(false);
    const [showParking, setShowParking] = useState(true);
    const [banDays, setBanDays] = useState(3);
    const [banReason, setBanReason] = useState(
        "przekroczenie limitu rezerwacji"
    );
    const [chargeAmount, setChargeAmount] = useState(150);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDateSelected, setIsDateSelected] = useState(false);

    const msgs = useRef<Toast>(null);
    const axios = useAxios();
    const { reserve } = usePostReservation();

    const getSpots = useGetSpots(setData, msgs);

    const location = useLocation();
    const navigate = useNavigate();

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
                    closable: false,
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
                (endTime.getTime() - startTime.getTime()) / 60_000; // ms to minutes

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
        const now = new Date();
        
        // Zaokrąglenie do najbliższych 10 minut w górę
        const minutes = now.getMinutes();
        const roundedMinutes = Math.ceil(minutes / 10) * 10;
        
        const start = new Date(now);
        start.setMinutes(roundedMinutes, 0, 0);
        
        // Jeśli zaokrąglenie przeszło do następnej godziny
        if (roundedMinutes >= 60) {
            start.setHours(start.getHours() + 1);
            start.setMinutes(0, 0, 0);
        }

        const end = new Date(start);
        end.setHours(end.getHours() + 4); // 4 godziny później

        const day = new Date();

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
        if (isBanned) setShowParking(false);
    }, [isBanned]);

    // TODO: Zmienić na pobieranie z API /parameters gdy endpoint będzie gotowy
    // Tymczasowo hardcode - minimalna długość rezerwacji to 30 minut
    const minReservationDuration = 30;

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

    // Walidacja minimalnej długości rezerwacji i czasu startu
    const validateDuration = (selection: DateTimeSelection<"single">) => {
        if (!selection.startTime || !selection.endTime) {
            return false;
        }
        
        // Sprawdzenie czy czas startu nie jest w przeszłości
        const now = new Date();
        const selectedStart = new Date(selection.days);
        selectedStart.setHours(selection.startTime.getHours(), selection.startTime.getMinutes(), 0, 0);
        
        if (selectedStart < now) {
            return false;
        }
        
        const durationMinutes = (selection.endTime.getTime() - selection.startTime.getTime()) / 60_000;
        return durationMinutes >= minReservationDuration;
    };

    return (
        <div className="parking-page" style={{
            padding: "2rem 1rem",
            maxWidth: "95%",
            margin: "0 auto"
        }}>
            {showParking ? (
                <>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            icon="pi pi-calendar"
                            label="Wybierz datę"
                            onClick={() => setDateSelectorVisible(true)}
                            style={{ width: "95%", justifyContent: "left" }}
                        />

                        <DateTimeDialog
                            visible={dateSelectorVisible}
                            selectionMode="single"
                            header="Wybierz czas i datę rezerwacji"
                            onHide={() => setDateSelectorVisible(false)}
                            initialSelection={{
                                days: selectedDayTime.day,
                                startTime: selectedDayTime.startTime,
                                endTime: selectedDayTime.endTime
                            }}
                            isValid={validateDuration}
                            onApply={(selection) => {
                                setDateSelectorVisible(false);
                                const newDayTime = {
                                    day: selection.days,
                                    startTime: selection.startTime!,
                                    endTime: selection.endTime!
                                };
                                setSelectedDayTime(newDayTime);
                                setIsDateSelected(true);
                            }}
                        />

                        <Divider />

                        <div style={{ 
                            opacity: isDateSelected ? 1 : 0.5,
                            pointerEvents: isDateSelected ? "auto" : "none",
                            transition: "opacity 0.3s ease",
                            position: "relative"
                        }}>
                            <ParkingGrid
                                spots={data}
                                selectedId={selectedId}
                                setSelectedId={setSelectedId}
                            />
                            {!isDateSelected && (
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                                    zIndex: 10,
                                    cursor: "pointer",
                                    pointerEvents: "auto"
                                }}
                                onClick={() => setDateSelectorVisible(true)}>
                                    <p style={{ color: "#666", fontSize: "1rem", margin: 0 }}>
                                        Wybierz datę rezerwacji
                                    </p>
                                </div>
                            )}
                        </div>

                        <Divider />

                        <div style={{ height: "180px" }} />
                    </div>

                    <div
                        style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            backgroundColor: "white",
                            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
                            zIndex: 100,
                            padding: "0.75rem 1rem",
                            gap: "0.5rem"
                        }}
                    >
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "1rem",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <div style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                                fontSize: "0.9rem",
                                flexWrap: "wrap",
                                flex: 1
                            }}>
                                <span style={{fontWeight: "500"}}>📍 {selectedId ?? "brak"}</span>
                                {isDateSelected ? (
                                    <>
                                        <span style={{color: "#999"}}>•</span>
                                        <span>{formatDateWeek(selectedDayTime.day)}</span>
                                        <span style={{color: "#999"}}>•</span>
                                        <span>{formatTime(selectedDayTime.startTime)}-{formatTime(selectedDayTime.endTime)}</span>
                                    </>
                                ) : (
                                    <span style={{color: "#999", fontStyle: "italic"}}>• Wybierz datę rezerwacji</span>
                                )}
                            </div>
                            <Button
                                label="Zatwierdź"
                                onClick={handleReserve}
                                disabled={selectedId == null}
                                size="small"
                                style={{whiteSpace: "nowrap"}}
                            />
                        </div>
                        <Toast position="bottom-center" ref={msgs} />
                    </div>
                </>
            ) : (
                <ErrorBanned
                    days={banDays}
                    reason={banReason}
                    charge={chargeAmount}
                    onPay={() => {
                        alert("Blokada została opłacona");
                        setIsBanned(false);
                        setShowParking(true);
                    }}
                    onWait={() => {
                        setShowParking(true);
                    }}
                />
            )}
        </div>
    );
}
