import { DataView } from 'primereact/dataview';
import { useHistoryEntries } from '../hooks/useHistoryEntries';
import { formatDate, isSameDay, endsBeforeNow, formatDateWeek } from '../utils/dateUtils';
import { useState } from "react";
import { Button } from "primereact/button";
import HistoryEntryComp from "../components/HistoryEntry";
import { Calendar } from "primereact/calendar";
import type { Nullable } from "primereact/ts-helpers";
import { Dialog } from "primereact/dialog";
import type { HistoryEntry } from "../models/HistoryEntry.tsx";

/**
 * Właściwości komponentu DateHeader.
 */
interface DateHeaderProps {
    /** Data do wyświetlenia w nagłówku */
    date: Date;
    /** Czy to pierwszy wpis na liście (zmniejsza margines) */
    isFirstEntry: boolean;
}

/**
 * Nagłówek daty w liście historii.
 * 
 * @param props - Właściwości komponentu
 * @internal
 */
function DateHeader({ date, isFirstEntry }: DateHeaderProps) {
    return (
        <div style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            marginTop: isFirstEntry ? '0.5rem' : '2rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #4b807b',
            textAlign: 'start'
        }}>
            {formatDateWeek(date)}
        </div>
    );
}

/**
 * Strona z historią rezerwacji użytkownika.
 * 
 * @remarks
 * Komponent wyświetlający listę wszystkich rezerwacji użytkownika z możliwością filtrowania.
 * 
 * Funkcjonalności:
 * - Wyświetlanie rezerwacji pogrupowanych po datach
 * - Filtrowanie: tylko aktualne/przyszłe lub wszystkie (włącznie z historycznymi)
 * - Filtrowanie po zakresie dat (kalendarz)
 * - Sortowanie od najnowszych do najstarszych
 * 
 * TODO: endsBeforeNow może nie działać poprawnie - wymaga weryfikacji filtrowania.
 * 
 * @example
 * ```tsx
 * <Route path="/history" element={<History />} />
 * ```
 */
export function History() {
    const { entries } = useHistoryEntries();

    const [dates, setDates] = useState<Nullable<(Date | null)[]>>(null);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [onlyNow, setOnlyNow] = useState<boolean>(true);

    const itemTemplate = (entry: HistoryEntry) => {
        return <HistoryEntryComp entry={entry} />;
    };

    const listTemplate = (items: HistoryEntry[] | undefined, onlyNow: boolean) => {
        if (!items || items.length === 0) {
            return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Brak rezerwacji
            </div>;
        }

        let displayItems = onlyNow
            ? items.filter(entry => !endsBeforeNow(new Date(entry.startTime),entry.durationMin))
            : items;

        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            const startDate = new Date(dates[0]);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(dates[1]);
            endDate.setHours(23, 59, 59, 999);

            displayItems = displayItems.filter(entry => {
                const entryDate = new Date(entry.startTime);
                return entryDate >= startDate && entryDate <= endDate;
            });
        }

        if (!displayItems || displayItems.length === 0) {
            return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                Brak rezerwacji
            </div>;
        }

        const list = displayItems.map((entry, index) => {
            const currentDate = new Date(entry.startTime);
            const previousDate = index > 0 ? new Date(displayItems[index - 1].startTime) : null;
            const showDate = !previousDate || !isSameDay(currentDate, previousDate);

            return (
                <div key={index}>
                    {showDate && <DateHeader date={currentDate} isFirstEntry={index === 0} />}
                    {itemTemplate(entry)}
                </div>
            );
        });

        return <div>{list}</div>;
    };

    const getButtonLabel = () => {
        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            const startDate = formatDate(dates[0]);
            const endDate = formatDate(dates[1]);
            return `${startDate} - ${endDate}`;
        }
        return "Filtruj daty";
    };

    return (

        <div>
            <Button
                icon="pi pi-calendar"
                label={getButtonLabel()}
                outlined
                onClick={()=>setShowCalendar(true)}
                style={{ width:'100%', justifyContent:'left' }}
            />

            <Dialog
                visible={showCalendar}
                onHide={() => setShowCalendar(false)}
                header="Wybierz zakres dat"
                style={{ width: '90vw', maxWidth: '400px' }}
            >
                <Calendar
                    value={dates}
                    onChange={(e) => {
                        setDates(e.value);
                        if (e.value &&
                            Array.isArray(e.value) &&
                            e.value.length === 2 && e.value[0] &&
                            e.value[1]) {
                            setShowCalendar(false);
                        }
                    }}
                    selectionMode="range"
                    inline
                    style={{ width: '100%',marginBottom:'24px',marginTop:'24px' }}
                />
            </Dialog>

            <DataView value={entries} listTemplate={(items) => listTemplate(items, onlyNow)}/>

            {(onlyNow || (dates && dates.length === 2 && dates[0] && dates[1])) && (
                <Button raised label="Historia" severity='secondary' onClick={() => {
                    setOnlyNow(false);
                    setDates(null);
                }} style={{ width: '100%' }} />
            )}
        </div>
    );
}