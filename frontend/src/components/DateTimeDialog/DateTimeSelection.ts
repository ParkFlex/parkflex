import type { CalendarSelectionMode } from "primereact/calendar";

export type DateTypeForSelection<SelMode extends CalendarSelectionMode> =
    SelMode extends 'multiple' ? Date[] : SelMode extends 'range' ? (Date | null)[] : Date;

/**
 * Represents the current DateTimeDialog selection
 */
export interface DateTimeSelection<SelMode extends CalendarSelectionMode> {
    days: DateTypeForSelection<SelMode>;
    startTime: Date | null;
    endTime: Date | null;
}

export const DateTimeSelection = {
    /**
     * Initial date selection. Time-related fields are set to `null`.
     *
     * Should be used in `DateTimeDialog` with `showTimeSelect` set to `false`.
     */
    initialWithoutTime: <SelMode extends CalendarSelectionMode>(selMode: SelMode) => {
        const now = new Date();

        let days: DateTypeForSelection<SelMode>;

        switch (selMode) {
            case "single":
                days = now as DateTypeForSelection<SelMode>;
                break;
            case "multiple":
                days = [now] as DateTypeForSelection<SelMode>;
                break;
            case "range": {
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                days = [now, tomorrow] as DateTypeForSelection<SelMode>;
                break;
            }
        }

        const ret: DateTimeSelection<SelMode> = {
            days,
            startTime: null,
            endTime: null
        };

        return ret;
    },

    /**
     * Initial date/time selection
     */
    initial: <SelMode extends CalendarSelectionMode>(selMode: SelMode) => {
        const now = new Date();

        const startTime = new Date(now);
        startTime.setHours(startTime.getHours() + 2);

        const endTime = new Date(now);
        endTime.setHours(endTime.getHours() + 4);

        const selection = DateTimeSelection.initialWithoutTime(selMode);

        selection.startTime = startTime;
        selection.endTime = endTime;

        return selection;
    }
};
