import {DataTable, type DataTableFilterMeta} from "primereact/datatable";
import {Column, type ColumnFilterElementTemplateOptions} from "primereact/column";
import type {UserListEntry} from "../models/UserListEntry.tsx";
import {useState} from "react";
import {Tag} from "primereact/tag";
import {classNames} from "primereact/utils";
import {Dialog} from "primereact/dialog";
import {AdminUserCard} from "./AdminUserCard.tsx";
import {Button} from "primereact/button";
import { useUserListEntry } from "../hooks/useUserListEntry";

export function AdminList(){
    const { userListEntries: users } = useUserListEntry();
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        'plate': { value: null, matchMode: 'startsWith' },
        'role': { value: null, matchMode: 'equals' },
        'blocked': { value: null, matchMode: 'equals' }
    })
    const [selectedUser, setSelectedUser] = useState<UserListEntry | null>(null);

    const blockedTemplate = (rowData: UserListEntry) => {
        return <i className={classNames('pi', { 'pi-ban': rowData.currentPenalty, 'pi-check': !rowData.currentPenalty })} style={rowData.currentPenalty ? { color: 'red' } : { color: 'green' }}></i>;
    };

     const roleTemplate = (user: UserListEntry) => {
         return <Tag value={user.role} severity={getSeverityR(user)} style={tagStyleForRole(user.role)}></Tag>;
     };

    const getSeverityR = (user: UserListEntry) => {
        switch (user.role) {
            case 'admin':
                return 'warning';
            case 'user':
                return 'success';
            default:
                return null;
        }
    };

    const dialogHeader = (selectedUser: UserListEntry | null) => {
        if (!selectedUser) return '';
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',marginRight:"0.5rem", marginLeft:"0.5rem" }}>
                <span>Szczegóły</span>
                {selectedUser.role === 'admin' && roleTemplate(selectedUser)}
            </div>
        );
    }

    const blockedRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button
                    icon="pi pi-ban"
                    rounded
                    outlined={options.value !== true}
                    severity="danger"
                    onClick={() => options.filterApplyCallback(options.value === true ? null : true)}
                />
                <Button
                    icon="pi pi-check"
                    rounded
                    outlined={options.value !== false}
                    severity="success"
                    onClick={() => options.filterApplyCallback(options.value === false ? null : false)}
                />
            </div>
        );
    };

    const tagStyleForRole = (role: string) => {
        if (role === 'admin'){
            return { backgroundColor: '#faa955', color:'white', fontSize:'1rem', padding: '0.25rem 0.5rem'};
        } else {
            return undefined;
        }
    };
    const filterApplyTemplate = (options: any) => {
        return <Button label="Zastosuj" onClick={options.filterApplyCallback} size="small" />;
    };

    const filterClearTemplate = (options: any) => {
        return <Button label="Wyczyść" onClick={options.filterClearCallback} size="small" outlined style={{marginRight:'0.5rem'}} />;
    };


    return (
        <div style={{ borderColor:'#d4e2da'}}>
            <DataTable
                value={users ?? []}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="menu"
                selectionMode="single"
                selection={selectedUser}
                onSelectionChange={(e) => setSelectedUser(e.value as UserListEntry | null)}
                dataKey="plate"
                emptyMessage="Brak użytkowników"
            >
                <Column field="plate" header="Tablica Rejestracyjna" filter showFilterMatchModes={false} filterPlaceholder='wyszukaj' filterApply={filterApplyTemplate} filterClear={filterClearTemplate} style={{ minWidth:'70%' }}></Column>
                <Column field="blocked" header="Status" body={blockedTemplate} dataType="boolean" filter filterElement={blockedRowFilterTemplate} filterApply={filterApplyTemplate} filterClear={filterClearTemplate} style={{ width: '20%', textAlign:"center" }}></Column>
            </DataTable>

            <Dialog header={dialogHeader(selectedUser)} visible={selectedUser !== null} onHide={() => setSelectedUser(null)} modal style={{width:'95%'}}>
                {selectedUser ? <AdminUserCard plate={selectedUser.plate} /> : null}
            </Dialog>
        </div>
    )
}