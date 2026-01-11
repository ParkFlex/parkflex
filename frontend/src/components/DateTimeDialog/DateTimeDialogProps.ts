import type { CalendarSelectionMode } from "primereact/calendar";
import { DateTimeSelection } from "./DateTimeSelection.ts";

export interface DateTimeDialogProps<SelMode extends CalendarSelectionMode> {
    visible: boolean;
    selectionMode: SelMode;

    /** Header shown at the top of the dialog */
    header: string;

    /** Run when closing the dialog window via the "x" mark */
    onHide: () => void;

    /** Run when clicking the "accept" button */
    onApply?: (selection: DateTimeSelection<SelMode>) => void;

    /**
     * Validity check of the current selection. The "accept" button will be
     * disabled depending on the output of this function.
     */
    isValid?: (selection: DateTimeSelection<SelMode>) => boolean;

    /** Callback run when the selection is cleared/reset */
    onClear?: () => void;

    /** Whether to show the time select input */
    showTimeSelect?: boolean;

    /** Whether to close the dialog after selecting the date */
    autoCloseOnDaySelect?: boolean;

    /**
     * Initial calendar selection. Updating this value will *not* change the value in the widget.
     *
     * Clicking the `reset` button will revert component's selection to this value.
     */
    initialSelection?: DateTimeSelection<SelMode>;

    /** Callback run every time the selection is changed  */
    onSelectionChange?: (selection: DateTimeSelection<SelMode>) => void;

    /** Whether to set selection to `initialSelection` every time when the dialog is opened */
    reloadInitialSelection?: boolean;
}
