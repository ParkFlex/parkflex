import { DateTimeDialog } from "../DateTimeDialog";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Chip } from "primereact/chip";
import { compareTime, formatDate, formatDateWeek, formatTime, isSameDay } from "../../utils/dateUtils.ts";
import { Toolbar } from "primereact/toolbar";
import type { DateTimeSelection } from "../DateTimeDialog/DateTimeSelection.ts";

interface DateSelectionProps {
    visible: boolean;
    setVisible: (x: boolean) => void;
    day: Date;
    setDay: (x: Date) => void;
    time: [Date, Date];
    setTime: (xs: [Date, Date]) => void;
}

export function DateTimeSelector(
    {
        visible,
        setVisible,
        day,
        setDay,
        time,
        setTime
    }: DateSelectionProps
) {

    const controls =
        <div
            className="p-inputgroup"
            style={
                ({
                    display: "flex",
                    flexDirection: "row",
                    width: "95%",
                    justifyItems: "stretch",
                    height: "3.5rem"
                })
            }>
            <span
                className="p-inputgroup-addon"
                style={ { flexGrow: "2" } }
            >
                {formatDateWeek(day)}
            </span>
            <span
                className="p-inputgroup-addon"
                style={ { flexGrow: "1" } }
            >
                {`${formatTime(time[0])} – ${formatTime(time[1])}`}
            </span>
            <Button
                style={{ width: "3em" }}
                onClick={() => setVisible(true)}
                icon="pi pi-pencil"
            />
        </div>;
    
    const validator = (day: Date, startTime: Date | null, endTime: Date | null) => {
        const now = new Date();

        if (startTime == null || endTime == null) return false;

        const timeSpanSwapped = compareTime(startTime, endTime) >= 0;
        if (timeSpanSwapped) return false;

        const isToday = isSameDay(now, day);
        if (isToday && compareTime(startTime, now) < 0) return false;

        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        const inPast = day.valueOf() < now.valueOf();
        if (inPast) return false;

        // TODO: max reservation time? padding, etc?

        return true;
    };

    return (
        <>
            <DateTimeDialog
                visible={visible}
                selectionMode="single"
                header="Wybierz czas i datę rezerwacji"

                initialSelection={
                    {
                        days: day,
                        startTime: time[0],
                        endTime: time[1]
                    }
                }

                onHide={() => {
                    setVisible(false);
                }}

                onApply={({ days, startTime, endTime }) => {
                    setVisible(false);
                    setDay(days);
                    setTime([startTime!, endTime!]); // we assert the non-nullability in `isValid`
                }}

                isValid={({ days, startTime, endTime }) => validator(days, startTime, endTime) }
            />

            {controls}

        </>
    );
}