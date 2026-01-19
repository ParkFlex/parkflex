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
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import { useGetSpots } from "../hooks/useGetSpots.tsx";
import { formatDateWeek, formatTime } from "../utils/dateUtils.ts";
import type { SpotState } from "../models/reservation/SpotState.ts";
import { usePrelude } from "../hooks/usePrelude.ts";
import { useAxios } from "../hooks/useAxios.ts";
import {penaltyReasonShowable} from "../models/PenaltyReason.ts";

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
            {prelude.penaltyInformation ? (
                <ErrorBanned
                    due={prelude.penaltyInformation?.due}
                    reason={penaltyReasonShowable(prelude.penaltyInformation.reason)}
                    charge={prelude.penaltyInformation.fine}
                    onPay={() => {
                        axios.post("/payment").then(getPrelude);
                    }}
                />
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
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

                    <Divider/>

                    <ParkingGrid
                        spots={data}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                    />

                    <Divider/>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Toolbar
                            style={{
                                width: "95%",
                                marginTop: "1em",
                            }}
                            start={
                                <>
                                    <p> Miejsce: {selectedId ?? "brak"}</p>
                                    <Divider layout={"vertical"}/>
                                    <p>
                                        {" "}
                                        {formatDateWeek(
                                            selectedDayTime.day
                                        )}{" "}
                                    </p>
                                    <Divider layout={"vertical"}/>
                                    <p>
                                        {formatTime(selectedDayTime.startTime)}-
                                        {formatTime(selectedDayTime.endTime)}
                                    </p>
                                </>
                            }
                            end={
                                <Button
                                    label="Zatwierdź"
                                    onClick={handleReserve}
                                    disabled={selectedId == null}
                                />
                            }
                        />
                        <Toast position="bottom-center" ref={msgs}/>
                    </div>
                </div>
            )}
        </div>
    );
}
