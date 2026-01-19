import { Dialog } from "primereact/dialog";
import { Calendar, type CalendarSelectionMode } from "primereact/calendar";
import { Button } from "primereact/button";
import { useState } from "react";
import { DateTimeSelection, type DateTypeForSelection } from "./DateTimeSelection.ts";
import type { DateTimeDialogProps } from "./DateTimeDialogProps.ts";


export function DateTimeDialog<SelMode extends CalendarSelectionMode>(
    {
        header,
        selectionMode,
        visible,
        onHide,
        isValid = _ => true,
        onSelectionChange = () => null,
        onApply = _ => null,
        onClear = () => null,
        showTimeSelect = true,
        autoCloseOnDaySelect = false,
        reloadInitialSelection = false,
        initialSelection =
            showTimeSelect
                ? DateTimeSelection.initial(selectionMode)
                : DateTimeSelection.initialWithoutTime(selectionMode)
    }: DateTimeDialogProps<SelMode>
) {
    type DateType = DateTypeForSelection<SelMode>; // either Date or Date[] or (Date | null)[]

    const [selection, setSelection] = useState(initialSelection);

    const isApplyDisabled = selection.days === null || !isValid(selection);

    function changeSelection(s: DateTimeSelection<SelMode>) {
        if (s != undefined) {
            setSelection(s);
            onSelectionChange(s);
        }
    }

    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            header={header}
            style={{ width: '95%', maxWidth: '400px' }}
        >
            <Calendar<SelMode, DateType>
                value={selection.days}
                selectionMode={selectionMode}
                inline
                locale="pl"
                style={{
                    minWidth: '100%',
                    width: '100%',
                    marginBottom: showTimeSelect ? undefined : '24px',
                    marginTop: showTimeSelect ? undefined : '24px'
                }}
                onShow={() => {
                    if (reloadInitialSelection) {
                        setSelection(initialSelection);
                    }
                }}
                onChange={(e) => {
                    if (e.value !== undefined && e.value !== null) {
                        const newSelection = { ...selection, days: e.value };
                        changeSelection(newSelection);

                        if (autoCloseOnDaySelect && isValid(newSelection)) {
                            onApply(newSelection);
                            onHide();
                        }
                    }

                }}
            />
            {showTimeSelect && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold'
                        }}>
                            Od godziny
                        </label>
                        <Calendar
                            value={selection.startTime}
                            onChange={(e) => {
                                if (e.value !== undefined)
                                    changeSelection({ ...selection, startTime: e.value });
                            }}
                            timeOnly
                            hourFormat="24"
                            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold'
                        }}>
                            Do godziny
                        </label>
                        <Calendar
                            value={selection.endTime}
                            onChange={(e) => {
                                if (e.value !== undefined)
                                    changeSelection({ ...selection, endTime: e.value });
                            }}
                            timeOnly
                            hourFormat="24"
                            style={{ width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                </div>
            )}
            {!autoCloseOnDaySelect && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button
                        label="Wyczyść"
                        icon="pi pi-times"
                        onClick={() => {
                            setSelection(initialSelection);
                            onClear();
                        }}
                        outlined
                        style={{ width: '100%', marginBottom: '24px' }}
                    />
                    <Button
                        label="Zastosuj"
                        icon="pi pi-check"
                        onClick={() => onApply(selection)}
                        style={{ width: '100%', marginBottom: '24px' }}
                        disabled={isApplyDisabled}
                    />
                </div>
            )}
        </Dialog>
    );
}