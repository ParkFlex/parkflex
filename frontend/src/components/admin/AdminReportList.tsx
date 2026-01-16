import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column, type ColumnFilterElementTemplateOptions } from "primereact/column";
import type { AdminReportEntry } from "../../models/admin/AdminReportEntry.tsx";
import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import {
    DateRangeFilterDialog,
    type DateRangeFilter,
    hasDateFilter,
    filterByDateRange,
    createEmptyDateRangeFilter
} from "../DateRangeFilterDialog.tsx";
import { classNames } from "primereact/utils";
import { useAdminReport } from "../../hooks/admin/useAdminReport.ts";

export function AdminReportList(){
    const { adminReportEntries:report, approveReport, changeReviewed } = useAdminReport();
    const [selectedReport, setSelectedReport] = useState<AdminReportEntry | null>(null);
    const toast = useRef<Toast>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        plate: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS }
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

    const dateTemplate = (rowData: AdminReportEntry) => {
        const date = new Date(rowData.timestamp).toLocaleDateString('pl-PL');
        const time = new Date(rowData.timestamp).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        return <><b>{date}</b><br/>{time}</>;
    };

    const dialogHeader = (selectedReport: AdminReportEntry | null) => {
        return (
            <div>
                {selectedReport && selectedReport.reviewed && selectedReport.penalty && (
                    <strong>Zgłoszenie zaakceptowne</strong>
                )}
                {selectedReport && selectedReport.reviewed && !selectedReport.penalty && (
                    <strong>Zgłoszenie odrzucone</strong>
                )}
                {selectedReport && !selectedReport.reviewed && (
                    <strong>Zgłoszenie oczekujące na weryfikację</strong>
                )}
            </div>
        );
    };

    const getStatus = (entry: AdminReportEntry): string => {
        if (!entry.reviewed) return 'pending';
        if ((entry.reviewed) && (entry.penalty)) return 'accepted';
        return 'rejected';
    };

    const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        const current = options.value as string | null;
        return (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button
                    icon="pi pi-check"
                    rounded
                    outlined={current !== 'accepted'}
                    severity="success"
                    onClick={() => options.filterApplyCallback(current === 'accepted' ? null : 'accepted')}
                />
                <Button
                    icon="pi pi-times"
                    rounded
                    outlined={current !== 'rejected'}
                    severity="danger"
                    onClick={() => options.filterApplyCallback(current === 'rejected' ? null : 'rejected')}
                />
                <Button
                    icon="pi pi-clock"
                    rounded
                    outlined={current !== 'pending'}
                    onClick={() => options.filterApplyCallback(current === 'pending' ? null : 'pending')}
                />
            </div>
        );
    };

    const getFilteredReports = (): (AdminReportEntry & { status: string })[] => {
        let items = filterByDateRange(report, dateFilter, (e) => new Date(e.timestamp));

        const plateRaw = (filters as any)?.plate?.value;
        if (plateRaw) {
            const needle = String(plateRaw).toLowerCase();
            items = items.filter(i => (i.plate || '').toLowerCase().includes(needle));
        }

        const rawStatus = (filters as any)?.status?.value;
        let statusVal: string | null = null;
        if (rawStatus === true || rawStatus === 'accepted' || rawStatus === 'yes') statusVal = 'accepted';
        else if (rawStatus === false || rawStatus === 'rejected' || rawStatus === 'no') statusVal = 'rejected';
        else if (rawStatus === 'pending') statusVal = 'pending';

        if (statusVal !== null) {
            items = items.filter(e => getStatus(e) === statusVal);
        }

        return items.map(e => ({ ...e, status: getStatus(e) }));
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

    const statusBodyTemplate = (rowData: AdminReportEntry) => {
        const entryStatus = getStatus(rowData);
        if (entryStatus === 'accepted') return <i className={classNames('pi', 'pi-check')} style={{ color: 'green' }} />;
        if (entryStatus === 'rejected') return <i className={classNames('pi', 'pi-times')} style={{ color: 'red' }} />;
        return <i className={classNames('pi', 'pi-clock')} style={{ color: 'grey' }} />;
    };

    return (
        <div style={{ borderColor:'#d4e2da' }}>
            <Toast ref={toast} position={"bottom-center"}/>
            <DataTable
                value={getFilteredReports()}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="menu"
                selectionMode="single"

                selection={selectedReport}
                onSelectionChange={(e) => setSelectedReport(e.value as AdminReportEntry | null)}
                dataKey="id"
                emptyMessage="Brak zgłoszeń"
            >
                <Column field='status' body={statusBodyTemplate} style={{ width: '15%', textAlign:'center' }} filter filterElement={statusRowFilterTemplate} filterApply={filterApplyTemplate} filterClear={filterClearTemplate} showFilterMatchModes={false}></Column>
                <Column field="plate" header="Rejestracja" filter filterElement={plateFilterTemplate} filterPlaceholder='wyszukaj' style={{ minWidth:'30%' }} showFilterMatchModes={false} filterApply={filterApplyTemplate} filterClear={filterClearTemplate}></Column>
                <Column field="issueTime" header={dateHeaderTemplate} body={dateTemplate} style={{ width: '25%' }}></Column>
            </DataTable>

            <Dialog header={dialogHeader(selectedReport)} visible={selectedReport !== null} onHide={() => setSelectedReport(null)} modal style={{ width:'95%' }}>
                {selectedReport && (
                    <div>
                        <p><strong>{new Date(selectedReport.timestamp).toLocaleDateString('pl-PL')}</strong> {new Date(selectedReport.timestamp).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>Tablica zgłoszonego:</strong> {selectedReport.plate}</p>
                        <p><strong>Kto zgłosił:</strong> {selectedReport.submitterPlate}</p>
                        <p><strong>Komentarz:</strong> {selectedReport.description}</p>
                        <img src={selectedReport.image} alt="report" style={{ width: '100%', marginBottom: '1rem', display: 'block' }} />
                        {selectedReport.reviewed && !selectedReport.penalty && (
                            <Button severity="secondary" style={{ width:'100%', marginBottom:'1rem', display:'flex', justifyContent:'center' }} onClick={async ()=>{
                                const success = await approveReport(selectedReport.id);
                                if (success) {
                                    setSelectedReport(null);
                                } else {
                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Błąd',
                                        detail: 'Nie udało się zaakceptować zgłoszenia',
                                        life: 3000
                                    });
                                }
                            }}>Zaakceptuj</Button>)}
                        {!selectedReport.reviewed && (
                            <div style={{ display:'flex', flexDirection:'row', gap:'1rem' }}>
                                <Button severity="secondary" style={{ width:'50%', marginBottom:'1rem', display:'flex', justifyContent:'center' }} onClick={async ()=>{
                                    const success = await approveReport(selectedReport.id);
                                    if (success) {
                                        setSelectedReport(null);
                                    } else {
                                        toast.current?.show({
                                            severity: 'error',
                                            summary: 'Błąd',
                                            detail: 'Nie udało się zaakceptować zgłoszenia',
                                            life: 3000
                                        });
                                    }
                                }}>Zaakceptuj</Button>
                                <Button style={{ width:'50%', marginBottom:'1rem', display:'flex', justifyContent:'center' }} onClick={async ()=> {
                                    await changeReviewed(selectedReport.id);
                                    setSelectedReport(null);
                                }}>Odrzuć</Button>
                            </div>)}
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
    );
}

