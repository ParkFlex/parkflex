import {DataTable, type DataTableFilterMeta} from "primereact/datatable";
import {Column, type ColumnFilterElementTemplateOptions} from "primereact/column";
import type {ReportEntry} from "../models/ReportEntry.tsx";
import {useState} from "react";
import { mockReportEntries } from "../mocks/mockReportEntries";
import {Dialog} from "primereact/dialog";
import {FilterMatchMode} from "primereact/api";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";

export function AdminReportList(){
    const [reports] = useState<ReportEntry[]>(mockReportEntries);
    const [selectedReport, setSelectedReport] = useState<ReportEntry | null>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        plate: { value: null, matchMode: FilterMatchMode.CONTAINS },
        banned: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [dates, setDates] = useState<(Date | null)[] | null>(null);
    const [startTimeFilter, setStartTimeFilter] = useState<Date | null>(null);
    const [endTimeFilter, setEndTimeFilter] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);

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

    const dateTemplate = (rowData: ReportEntry) => {
        const date = rowData.issueTime.toLocaleDateString('pl-PL');
        const time = rowData.issueTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        return <><b>{date}</b><br/>{time}</>;
    };

    const dialogHeader = (report: ReportEntry | null) => {
        return <div style={{marginRight:'1rem'}}>Szczegóły zgłoszenia</div>;
    };

    const getFilteredReports = (): ReportEntry[] => {
        let filtered = reports;

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
                const entryDate = new Date(e.issueTime);
                return entryDate >= startDate && entryDate <= endDate;
            });
        }

        return filtered;
    };

    const dateHeaderTemplate = () => {
        const hasFilter = dates && dates.length === 2 && dates[0] && dates[1];
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Data zgłoszenia</span>
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

    return (
        <div style={{ borderColor:'#d4e2da'}}>
            <DataTable
                value={getFilteredReports()}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="menu"
                selectionMode="single"

                selection={selectedReport}
                onSelectionChange={(e) => setSelectedReport(e.value as ReportEntry | null)}
                dataKey="plate"
                emptyMessage="Brak zgłoszeń"
            >
                <Column field="plate" header="Rejestracja" filter filterElement={plateFilterTemplate} filterPlaceholder='wyszukaj' style={{ minWidth:'30%' }} showFilterMatchModes={false} filterApply={filterApplyTemplate} filterClear={filterClearTemplate}></Column>
                <Column field="issueTime" header={dateHeaderTemplate} body={dateTemplate} style={{ width: '25%' }}></Column>
            </DataTable>

            <Dialog header={dialogHeader(selectedReport)} visible={selectedReport !== null} onHide={() => setSelectedReport(null)} modal>
                {selectedReport && (
                    <div>
                        <p><strong>{selectedReport.issueTime.toLocaleDateString('pl-PL')}</strong> {selectedReport.issueTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>Tablica zgłoszonego:</strong> {selectedReport.plate}</p>
                        <p><strong>Kto zgłosił:</strong> {selectedReport.whoReported}</p>
                        <p><strong>Komentarz:</strong> {selectedReport.comment}</p>
                        <img src={selectedReport.photoUrl} style={{ maxWidth: '100%', width: '300px', marginBottom: '1rem', display: 'block' }} />
                    </div>
                )}
            </Dialog>

            <Dialog
                visible={showCalendar}
                onHide={() => setShowCalendar(false)}
                header="Wybierz zakres dat i godzin"
                style={{ width: '95%', maxWidth: '400px' }}
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
        </div>
    )
}

//move calendar to different component