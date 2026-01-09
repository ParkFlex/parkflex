import { DateTimeDialog } from "../DateTimeDialog";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Chip } from "primereact/chip";
import { compareTime, formatDate, formatDateWeek, formatTime, isSameDay } from "../../utils/dateUtils.ts";
import { Toolbar } from "primereact/toolbar";
import type { DateTimeSelection } from "../DateTimeDialog/DateTimeSelection.ts";

export type DateTimeSpan = {
    day: Date,
    startTime: Date,
    endTime: Date
};

interface DateSelectionProps {
    visible: boolean;
    setVisible: (x: boolean) => void;
    dayTime: DateTimeSpan;
    setDayTime: (dateTimeSpan: DateTimeSpan) => void;
}

export function DateTimeSelector(
    {
        visible,
        setVisible,
        dayTime,
        setDayTime,
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
                {formatDateWeek(dayTime.day)}
            </span>
            <span
                className="p-inputgroup-addon"
                style={ { flexGrow: "1" } }
            >
                {`${formatTime(dayTime.startTime!)} – ${formatTime(dayTime.endTime!)}`}
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

                initialSelection={{
                    days: dayTime.day,
                    startTime: dayTime.startTime,
                    endTime: dayTime.endTime
                }}

                onHide={() => {
                    setVisible(false);
                }}

                onApply={newDayTime => {
                    setVisible(false);
                    setDayTime({
                        day: newDayTime.days,
                        startTime: newDayTime.startTime!,
                        endTime: newDayTime.endTime!
                    });
                }}

                isValid={({ days, startTime, endTime }) => validator(days, startTime, endTime) }
            />

            {controls}

        </>
    );
}