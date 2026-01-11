import {useState} from "react";
import type {AdminHistoryEntry} from "../models/AdminHistoryEntry.tsx";
import {DataTable, type DataTableFilterMeta} from "primereact/datatable";
import {Column, type ColumnFilterElementTemplateOptions} from "primereact/column";
import {useAdminHistory} from "../hooks/useAdminHistory.ts";
import {Dialog} from "primereact/dialog";
import {AdminHistoryCard} from "./AdminHistoryCard.tsx";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import {formatTime, addMinutes, formatDate, isActiveNow} from "../utils/dateUtils.ts";
import {Button} from "primereact/button";
import {OverlayPanel} from "primereact/overlaypanel";
import {useRef} from "react";
import {
    DateRangeFilterDialog,
    type DateRangeFilter,
    hasDateFilter,
    filterByDateRange,
    createEmptyDateRangeFilter
} from "./DateRangeFilterDialog";

export function AdminHistoryList() {
     const entries  = useAdminHistory();
     const [selectedEntry, setSelectedEntry] = useState<AdminHistoryEntry | null>(null);
     const [filters, setFilters] = useState<DataTableFilterMeta>({
        'plate': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'startTime': { value: null, matchMode: FilterMatchMode.DATE_IS }
    })
     const [dateFilter, setDateFilter] = useState<DateRangeFilter>(createEmptyDateRangeFilter());
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
        let filtered = filterByDateRange(entries, dateFilter, (e) => new Date(e.startTime));

        if (statusFilter) {
            filtered = filtered.filter(e => getEntryStatus(e) === statusFilter);
        }

        return filtered;
    };

    const dateHeaderTemplate = () => {
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
                        backgroundColor: hasDateFilter(dateFilter) ? '#d4e2da' : 'transparent'
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

    const dialogHeaderTemplate = () => {
        return (
            <div style={{display:'flex', alignItems:'center', flexDirection:'row',gap:'1rem'}}>
                <div>{selectedEntry ? statusTemplate(selectedEntry) :null}</div>
                <div style={{marginRight:'1rem'}}>Rezerwacja</div>
            </div>
        );
    }

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

            <Dialog header={dialogHeaderTemplate()} visible={selectedEntry !== null} onHide={() => setSelectedEntry(null)} modal style={{width:'95%'}}>
                {selectedEntry ? <AdminHistoryCard plate={selectedEntry.plate} startTime={selectedEntry.startTime} /> : null}
            </Dialog>
        </div>
    )
}

