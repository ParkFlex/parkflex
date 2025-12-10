import { DataView } from 'primereact/dataview';
import { useHistoryEntries } from '../hooks/useHistoryEntries';
import { formatDate, isSameDay, endsBeforeNow, formatDateWeek } from '../utils/dateUtils';
import { useState } from "react";
import { Button } from "primereact/button";
import HistoryEntryComp from "../components/HistoryEntry";
import type { HistoryEntry } from "../models/HistoryEntry.tsx";
import {
    DateRangeFilterDialog,
    type DateRangeFilter,
    hasDateFilter,
    filterByDateRange,
    createEmptyDateRangeFilter
} from "../components/DateRangeFilterDialog";

interface DateHeaderProps {
    date: Date;
    isFirstEntry: boolean;
}

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

export function History() {
    const { entries } = useHistoryEntries();

    const [dateFilter, setDateFilter] = useState<DateRangeFilter>(createEmptyDateRangeFilter());
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

        displayItems = filterByDateRange(displayItems, dateFilter, (entry) => new Date(entry.startTime));

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
        const { dates } = dateFilter;
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

            <DateRangeFilterDialog
                visible={showCalendar}
                onHide={() => setShowCalendar(false)}
                filter={dateFilter}
                onFilterChange={setDateFilter}
                onApply={() => setShowCalendar(false)}
                onClear={() => {
                    setDateFilter(createEmptyDateRangeFilter());
                    setShowCalendar(false);
                }}
                showTimeFilter={false}
                autoCloseOnRangeSelect={true}
            />

            <DataView value={entries} listTemplate={(items) => listTemplate(items, onlyNow)}/>

            {(onlyNow || hasDateFilter(dateFilter)) && (
                <Button raised label="Historia" severity='secondary' onClick={() => {
                    setOnlyNow(false);
                    setDateFilter(createEmptyDateRangeFilter());
                }} style={{ width: '100%' }} />
            )}
        </div>
    );
}