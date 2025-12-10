import {DataTable, type DataTableFilterMeta} from "primereact/datatable";
import {Column, type ColumnFilterElementTemplateOptions} from "primereact/column";
import type {ReportEntry} from "../models/ReportEntry.tsx";
import {useState} from "react";
import { mockReportEntries } from "../mocks/mockReportEntries";
import {Dialog} from "primereact/dialog";
import {FilterMatchMode} from "primereact/api";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {
    DateRangeFilterDialog,
    type DateRangeFilter,
    hasDateFilter,
    filterByDateRange,
    createEmptyDateRangeFilter
} from "./DateRangeFilterDialog";

export function AdminReportList(){
    const [reports] = useState<ReportEntry[]>(mockReportEntries);
    const [selectedReport, setSelectedReport] = useState<ReportEntry | null>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        plate: { value: null, matchMode: FilterMatchMode.CONTAINS },
        banned: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [dateFilter, setDateFilter] = useState<DateRangeFilter>(createEmptyDateRangeFilter());
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
        return filterByDateRange(reports, dateFilter, (e) => e.issueTime);
    };

    const dateHeaderTemplate = () => {
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
                        backgroundColor: hasDateFilter(dateFilter) ? '#d4e2da' : 'transparent'
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
            />
        </div>
    )
}
