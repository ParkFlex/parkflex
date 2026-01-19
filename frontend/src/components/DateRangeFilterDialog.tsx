import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

export interface DateRangeFilter {
    dates: (Date | null)[] | null;
    startTime: Date | null;
    endTime: Date | null;
}

interface DateRangeFilterDialogProps {
    visible: boolean;
    onHide: () => void;
    filter: DateRangeFilter;
    onFilterChange: (filter: DateRangeFilter) => void;
    onApply: () => void;
    onClear: () => void;
    showTimeFilter?: boolean;
    autoCloseOnRangeSelect?: boolean;
}

export function DateRangeFilterDialog({
    visible,
    onHide,
    filter,
    onFilterChange,
    onApply,
    onClear,
    showTimeFilter = true,
    autoCloseOnRangeSelect = false
}: DateRangeFilterDialogProps) {
    const { dates, startTime, endTime } = filter;

    const isApplyDisabled = !(dates && dates.length === 2 && dates[0] && dates[1]);

    const handleDateChange = (value: (Date | null)[] | null) => {
        onFilterChange({ ...filter, dates: value ?? null });

        if (autoCloseOnRangeSelect && value && value.length === 2 && value[0] && value[1]) {
            onApply();
        }
    };

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={showTimeFilter ? "Wybierz zakres dat i godzin" : "Wybierz zakres dat"}
            style={{ width: '95%', maxWidth: '400px' }}
        >
            <Calendar
                value={dates}
                onChange={(e) => handleDateChange(e.value ?? null)}
                selectionMode="range"
                inline
                locale="pl"
                style={{ width: '100%', marginBottom: showTimeFilter ? undefined : '24px', marginTop: showTimeFilter ? undefined : '24px' }}
            />
            {showTimeFilter && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Od godziny</label>
                        <Calendar
                            value={startTime}
                            onChange={(e) => onFilterChange({ ...filter, startTime: e.value ?? null })}
                            timeOnly
                            hourFormat="24"
                            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Do godziny</label>
                        <Calendar
                            value={endTime}
                            onChange={(e) => onFilterChange({ ...filter, endTime: e.value ?? null })}
                            timeOnly
                            hourFormat="24"
                            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                </div>
            )}
            {!autoCloseOnRangeSelect && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button
                        label="Wyczyść"
                        icon="pi pi-times"
                        onClick={onClear}
                        outlined
                        style={{ width: '100%', marginBottom: '24px' }}
                    />
                    <Button
                        label="Zastosuj"
                        icon="pi pi-check"
                        onClick={onApply}
                        style={{ width: '100%', marginBottom: '24px' }}
                        disabled={isApplyDisabled}
                    />
                </div>
            )}
        </Dialog>
    );
}

export function hasDateFilter(filter: DateRangeFilter): boolean {
    return !!(filter.dates && filter.dates.length === 2 && filter.dates[0] && filter.dates[1]);
}

export function filterByDateRange<T>(
    items: T[],
    filter: DateRangeFilter,
    getDate: (item: T) => Date
): T[] {
    if (!hasDateFilter(filter)) {
        return items;
    }

    const { dates, startTime, endTime } = filter;

    const startDate = new Date(dates![0]!);
    if (startTime) {
        startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    } else {
        startDate.setHours(0, 0, 0, 0);
    }

    const endDate = new Date(dates![1]!);
    if (endTime) {
        endDate.setHours(endTime.getHours(), endTime.getMinutes(), 59, 999);
    } else {
        endDate.setHours(23, 59, 59, 999);
    }

    return items.filter(item => {
        const itemDate = new Date(getDate(item));
        return itemDate >= startDate && itemDate <= endDate;
    });
}

export function createEmptyDateRangeFilter(): DateRangeFilter {
    return {
        dates: null,
        startTime: null,
        endTime: null
    };
}

