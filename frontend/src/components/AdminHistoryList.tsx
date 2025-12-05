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

export function AdminHistoryList() {
     const [entry] = useState<AdminHistoryEntry[]>(mockHistoryList);
     const [selectedEntry, setSelectedEntry] = useState<AdminHistoryEntry | null>(null);
     const [filters, setFilters] = useState<DataTableFilterMeta>({
        'plate': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'startTime': { value: null, matchMode: FilterMatchMode.DATE_IS }
    })


     /////
    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };
    const addMinutes = (date: Date, minutes: number): Date => {
        return new Date(date.getTime() + minutes * 60000);
    };
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('pl-EU', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    }
     //////

    const endTime = (rowData: AdminHistoryEntry): Date => {
        return addMinutes(new Date(rowData.startTime), rowData.durationMin);
    }

    const timeTemplate = (rowData: AdminHistoryEntry) => {
        const date = formatDate(new Date(rowData.startTime));
        const start = formatTime(new Date(rowData.startTime));
        const end = formatTime(endTime(rowData));
        return <><b>{date}</b><br/>{start} - {end}</>;
    }

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar
            value={options.value}
            onChange={(e) => options.filterCallback(e.value, options.index)}
            dateFormat="dd/mm/yy"
            placeholder="Wybierz datę"
            autoFocus
        />;
    };

    const plateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <InputText
            value={options.value || ''}
            onChange={(e) => options.filterCallback(e.target.value, options.index)}
            placeholder="Wyszukaj"
            autoFocus
        />;
    };

    const filterDate = (value: Date, filter: Date): boolean => {
        if (!filter) return true;
        const rowDate = new Date(value);
        return rowDate.toDateString() === filter.toDateString();
    };

    return (
        <div>
            <DataTable
                value={entry}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="menu"
                selectionMode="single"
                selection={selectedEntry}
                onSelectionChange={(e) => setSelectedEntry(e.value as AdminHistoryEntry | null)}
                dataKey="plate"
                emptyMessage="Brak historii"
            >
                <Column field="plate" header="Tablica" filter filterElement={plateFilterTemplate} showFilterMatchModes={false} style={{ width:'10%', fontWeight: "bold" }}></Column>
                <Column field="startTime" header="Data i czas" body={timeTemplate} filter filterElement={dateFilterTemplate} filterFunction={filterDate} showFilterMatchModes={false} style={{ width: '40%' }}></Column>
                {/*<Column field="spot" header="Miejsce" dataType="numeric" filter style={{ width: '15%', textAlign:"center" }}></Column>*/}
            </DataTable>

            <Dialog header='Rezerwacja' visible={selectedEntry !== null} onHide={() => setSelectedEntry(null)} modal style={{width:'90%'}}>
                {selectedEntry ? <AdminHistoryCard plate={selectedEntry.plate} startTime={selectedEntry.startTime} /> : null}
            </Dialog>
        </div>
    )
}
////////////filtrowanie, penalty, completed/active/planned