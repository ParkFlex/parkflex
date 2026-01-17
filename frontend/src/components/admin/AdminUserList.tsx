import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column, type ColumnFilterElementTemplateOptions } from "primereact/column";
import type { AdminUserEntry } from "../../models/admin/AdminUserEntry.tsx";
import { useState } from "react";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import { AdminUserCard } from "./AdminUserCard.tsx";
import { Button } from "primereact/button";
import { useUserList } from "../../hooks/admin/useUserList.ts";

export function AdminUserList(){
    const { userListEntries: users } = useUserList();
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        'plate': { value: null, matchMode: 'startsWith' },
        'role': { value: null, matchMode: 'equals' },
        'status': { value: null, matchMode: 'equals' }
    });
    const [selectedUser, setSelectedUser] = useState<AdminUserEntry | null>(null);

    const statusBodyTemplate = (rowData: AdminUserEntry) => {
        const entryStatus = getStatus(rowData);
        if (entryStatus === 'blocked') return <i className={classNames('pi', 'pi-ban')} style={{ color: 'red' }} />;
        return <i className={classNames('pi', 'pi-check')} style={{ color: 'green' }} />;
    };

    const roleTemplate = (user: AdminUserEntry) => {
        return <Tag value={user.role} severity={getSeverityR(user)} style={tagStyleForRole(user.role)}></Tag>;
    };

    const getSeverityR = (user: AdminUserEntry) => {
        switch (user.role) {
            case 'admin':
                return 'warning';
            case 'user':
                return 'success';
            default:
                return null;
        }
    };

    const dialogHeader = (selectedUser: AdminUserEntry | null) => {
        if (!selectedUser) return '';
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',marginRight:"0.5rem", marginLeft:"0.5rem" }}>
                <span>Szczegóły</span>
                {selectedUser.role === 'admin' && roleTemplate(selectedUser)}
            </div>
        );
    };

    const getStatus = (entry: AdminUserEntry): string => {
        if (entry.currentPenalty) return 'blocked';
        return 'active';
    };

    const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        const current = options.value as string | null;
        return (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button
                    icon="pi pi-ban"
                    rounded
                    outlined={current !== 'blocked'}
                    severity="danger"
                    onClick={() => options.filterApplyCallback(current === 'blocked' ? null : 'blocked')}
                />
                <Button
                    icon="pi pi-check"
                    rounded
                    outlined={current !== 'active'}
                    severity="success"
                    onClick={() => options.filterApplyCallback(current === 'active' ? null : 'active')}
                />
            </div>
        );
    };

    const getFilteredUsers = (): (AdminUserEntry & { status: string })[] => {
        let items = users ?? [];

        const plateRaw = (filters as any)?.plate?.value;
        if (plateRaw) {
            const needle = String(plateRaw).toLowerCase();
            items = items.filter(i => (i.plate || '').toLowerCase().startsWith(needle));
        }

        const rawStatus = (filters as any)?.status?.value;
        let statusVal: string | null = null;
        if (rawStatus === true || rawStatus === 'blocked' || rawStatus === 'yes') statusVal = 'blocked';
        else if (rawStatus === false || rawStatus === 'active' || rawStatus === 'no') statusVal = 'active';

        if (statusVal !== null) {
            items = items.filter(e => getStatus(e) === statusVal);
        }

        return items.map(e => ({ ...e, status: getStatus(e) }));
    };

    const tagStyleForRole = (role: string) => {
        if (role === 'admin'){
            return { backgroundColor: '#faa955', color:'white', fontSize:'1rem', padding: '0.25rem 0.5rem' };
        } else {
            return undefined;
        }
    };
    const filterApplyTemplate = (options: any) => {
        return <Button label="Zastosuj" onClick={options.filterApplyCallback} size="small" />;
    };

    const filterClearTemplate = (options: any) => {
        return <Button label="Wyczyść" onClick={options.filterClearCallback} size="small" outlined style={{ marginRight:'0.5rem' }} />;
    };


    return (
        <div style={{ borderColor:'#d4e2da' }}>
            <DataTable
                value={getFilteredUsers()}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                filterDisplay="menu"
                selectionMode="single"
                selection={selectedUser}
                onSelectionChange={(e) => setSelectedUser(e.value as AdminUserEntry | null)}
                dataKey="plate"
                emptyMessage="Brak użytkowników"
            >
                <Column field="plate" header="Tablica Rejestracyjna" filter showFilterMatchModes={false} filterPlaceholder='wyszukaj' filterApply={filterApplyTemplate} filterClear={filterClearTemplate} style={{ minWidth:'70%' }}></Column>
                <Column field='status' header="Status" body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} filterApply={filterApplyTemplate} filterClear={filterClearTemplate} showFilterMatchModes={false} style={{ width: '20%', textAlign:"center" }}></Column>
            </DataTable>

            <Dialog header={dialogHeader(selectedUser)} visible={selectedUser !== null} onHide={() => setSelectedUser(null)} modal style={{ width:'95%' }}>
                {selectedUser ? <AdminUserCard userId={selectedUser.id} /> : null}
            </Dialog>
        </div>
    );
}