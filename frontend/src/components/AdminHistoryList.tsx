import {useState} from "react";
import type {AdminHistoryEntry} from "../models/AdminHistoryEntry.tsx";
import {DataTable, type DataTableFilterMeta} from "primereact/datatable";
import {Column, type ColumnFilterElementTemplateOptions} from "primereact/column";
import {mockHistoryList} from "../mocks/historyListMock.ts";
import {Dialog} from "primereact/dialog";
import {AdminHistoryCard} from "./AdminHistoryCard.tsx";
import {Calendar} from "primereact/calendar";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import {formatTime, addMinutes, formatDate, isActiveNow} from "../utils/dateUtils.ts";
import {Button} from "primereact/button";
import {OverlayPanel} from "primereact/overlaypanel";
import {useRef} from "react";

export function AdminHistoryList() {
     const [entry] = useState<AdminHistoryEntry[]>(mockHistoryList);
     const [selectedEntry, setSelectedEntry] = useState<AdminHistoryEntry | null>(null);
     const [filters, setFilters] = useState<DataTableFilterMeta>({
        'plate': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'startTime': { value: null, matchMode: FilterMatchMode.DATE_IS }
    })
     const [dates, setDates] = useState<(Date | null)[] | null>(null);
     const [startTimeFilter, setStartTimeFilter] = useState<Date | null>(null);
     const [endTimeFilter, setEndTimeFilter] = useState<Date | null>(null);
     const [showCalendar, setShowCalendar] = useState<boolean>(false);
     const [statusFilter, setStatusFilter] = useState<string | null>(null);
     const statusOverlayRef = useRef<OverlayPanel>(null);


    const endTime = (rowData: AdminHistoryEntry): Date => {
        return addMinutes(new Date(rowData.startTime), rowData.durationMin);
    }

    const timeTemplate = (rowData: AdminHistoryEntry) => {
        const date = formatDate(new Date(rowData.startTime));
        const start = formatTime(new Date(rowData.startTime));
        const end = formatTime(endTime(rowData));
        return <><b>{date}</b><br/>{start} - {end}</>;
    }

    const plateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputText
            value={options.value || ''}
            onChange={(e) => options.filterCallback(e.target.value, options.index)}
            placeholder="Wyszukaj"
            autoFocus
        />;
    };

    const filterApplyTemplate = (options: any) => {
        return <Button label="Zastosuj" onClick={options.filterApplyCallback} size="small" />;
    };

    const filterClearTemplate = (options: any) => {
        return <Button label="Wyczyść" onClick={options.filterClearCallback} size="small" outlined />;
    };

    const getEntryStatus = (rowData: AdminHistoryEntry): string => {
        const now = new Date();
        const startTime = new Date(rowData.startTime);
        const end = addMinutes(startTime, rowData.durationMin);
        if (rowData.status === 'penalty') return 'penalty';
        if (isActiveNow(startTime, rowData.durationMin)) return 'active';
        if (startTime > now) return 'planned';
        if (end < now) return 'completed';
        return '';
    };

    const getFilteredEntries = (): AdminHistoryEntry[] => {
        let filtered = entry;

        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            const startDate = new Date(dates[0]);
            if (startTimeFilter) {
                startDate.setHours(startTimeFilter.getHours(), startTimeFilter.getMinutes(), 0, 0);
            } else {
                startDate.setHours(0, 0, 0, 0);
            }
            const endDate = new Date(dates[1]);
            if (endTimeFilter) {
                endDate.setHours(endTimeFilter.getHours(), endTimeFilter.getMinutes(), 59, 999);
            } else {
                endDate.setHours(23, 59, 59, 999);
            }

            filtered = filtered.filter(e => {
                const entryDate = new Date(e.startTime);
                return entryDate >= startDate && entryDate <= endDate;
            });
        }

        if (statusFilter) {
            filtered = filtered.filter(e => getEntryStatus(e) === statusFilter);
        }

        return filtered;
    };

    const dateHeaderTemplate = () => {
        const hasFilter = dates && dates.length === 2 && dates[0] && dates[1];
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Data i czas</span>
                <Button
                    icon="pi pi-calendar"
                    rounded
                    text
                    onClick={() => setShowCalendar(true)}
                    style={{
                        padding: '0.25rem',
                        backgroundColor: hasFilter ? '#d4e2da' : 'transparent'
                    }}
                />
            </div>
        );
    };

    const statusHeaderTemplate = () => {
        return (
            <>
                <Button
                    icon="pi pi-filter"
                    rounded
                    text
                    onClick={(e) => statusOverlayRef.current?.toggle(e)}
                    style={{
                        width:'2rem',
                        backgroundColor: statusFilter ? '#d4e2da' : 'transparent'
                    }}
                />
                <OverlayPanel ref={statusOverlayRef}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem' }}>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px', backgroundColor: statusFilter === 'penalty' ? '#fef2f2' : 'transparent' }}
                            onClick={() => { setStatusFilter(statusFilter === 'penalty' ? null : 'penalty'); statusOverlayRef.current?.hide(); }}
                        >
                            <i className="pi pi-exclamation-triangle" style={{ color: '#ef4444', fontSize: '1.25rem' }} />
                            <span>Kara</span>
                        </div>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px', backgroundColor: statusFilter === 'active' ? '#f0fdf4' : 'transparent' }}
                            onClick={() => { setStatusFilter(statusFilter === 'active' ? null : 'active'); statusOverlayRef.current?.hide(); }}
                        >
                            <i className="pi pi-spin pi-spinner" style={{ color: 'green', fontSize: '1.25rem' }} />
                            <span>Aktywna</span>
                        </div>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px', backgroundColor: statusFilter === 'planned' ? '#eff6ff' : 'transparent' }}
                            onClick={() => { setStatusFilter(statusFilter === 'planned' ? null : 'planned'); statusOverlayRef.current?.hide(); }}
                        >
                            <i className="pi pi-clock" style={{ color: 'var(--primary-color)', fontSize: '1.25rem' }} />
                            <span>Zaplanowana</span>
                        </div>
                        <div
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px', backgroundColor: statusFilter === 'completed' ? '#f3f4f6' : 'transparent' }}
                            onClick={() => { setStatusFilter(statusFilter === 'completed' ? null : 'completed'); statusOverlayRef.current?.hide(); }}
                        >
                            <i className="pi pi-check" style={{ color: 'gray', fontSize: '1.25rem' }} />
                            <span>Zakończona</span>
                        </div>
                    </div>
                </OverlayPanel>
            </>
        );
    };

    const statusTemplate = (rowData: AdminHistoryEntry) => {
        const status = getEntryStatus(rowData);
        if (status === 'penalty') {
            return <i className="pi pi-exclamation-triangle" style={{ color: '#ef4444', fontSize: '1.25rem' }} title="Kara" />;
        }
        if (status === 'active') {
            return <i className="pi pi-spin pi-spinner" style={{ color: 'green', fontSize: '1.25rem' }} title="Aktywna" />;
        }
        if (status === 'planned') {
            return <i className="pi pi-clock" style={{ fontSize: '1.25rem' }} title="Zaplanowana" />;
        }
        if (status === 'completed') {
            return <i className="pi pi-check" style={{ color: 'gray', fontSize: '1.25rem' }} title="Zakończona" />;
        }

        return null;
    };

    return (
        <div>
            <DataTable
                value={getFilteredEntries()}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="menu"
                selectionMode="single"
                selection={selectedEntry}
                onSelectionChange={(e) => setSelectedEntry(e.value as AdminHistoryEntry | null)}
                dataKey="plate"
                emptyMessage="Brak historii"
            >
                <Column field="status" header={statusHeaderTemplate} body={statusTemplate} style={{ width: '10%', textAlign: 'center' }} alignHeader="center"></Column>
                <Column field="plate" header="Tablica" filter filterElement={plateFilterTemplate} filterApply={filterApplyTemplate} filterClear={filterClearTemplate} showFilterMatchModes={false} style={{ width:'10%' }} bodyStyle={{ fontWeight: "bold" }}></Column>
                <Column field="startTime" header={dateHeaderTemplate} body={timeTemplate} style={{ width: '40%' }}></Column>
                {/*<Column field="spot" header="Miejsce" dataType="numeric" filter style={{ width: '15%', textAlign:"center" }}></Column>*/}
            </DataTable>

            <Dialog
                visible={showCalendar}
                onHide={() => setShowCalendar(false)}
                header="Wybierz zakres dat i godzin"
                style={{ width: '90vw', maxWidth: '400px' }}
            >
                <Calendar
                    value={dates}
                    onChange={(e) => {
                        setDates(e.value ?? null);
                    }}
                    selectionMode="range"
                    inline
                    style={{ width: '100%'}}
                />
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Od godziny</label>
                        <Calendar
                            value={startTimeFilter}
                            onChange={(e) => setStartTimeFilter(e.value ?? null)}
                            timeOnly
                            hourFormat="24"
                            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Do godziny</label>
                        <Calendar
                            value={endTimeFilter}
                            onChange={(e) => setEndTimeFilter(e.value ?? null)}
                            timeOnly
                            hourFormat="24"
                            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px'  }}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                    label="Wyczyść"
                    icon="pi pi-times"
                    onClick={() => {
                        setDates(null);
                        setStartTimeFilter(null);
                        setEndTimeFilter(null);
                        setShowCalendar(false);
                    }}
                    outlined
                    style={{ width: '100%', marginBottom:'24px'}}
                />
                <Button
                    label="Zastosuj"
                    icon="pi pi-check"
                    onClick={() => setShowCalendar(false)}
                    style={{ width: '100%', marginBottom:'24px' }}
                    disabled={!(dates && dates.length === 2 && dates[0] && dates[1])}
                />
                </div>
            </Dialog>

            <Dialog header='Rezerwacja' visible={selectedEntry !== null} onHide={() => setSelectedEntry(null)} modal style={{width:'90%'}}>
                {selectedEntry ? <AdminHistoryCard plate={selectedEntry.plate} startTime={selectedEntry.startTime} /> : null}
            </Dialog>
        </div>
    )
}

//*dodac kolumne spotu dla szerszej tableli
