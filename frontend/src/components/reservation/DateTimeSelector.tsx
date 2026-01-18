import { DateTimeDialog } from "../DateTimeDialog";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Chip } from "primereact/chip";
import { compareTime, formatDate, formatDateWeek, formatTime, isSameDay } from "../../utils/dateUtils.ts";
import { Toolbar } from "primereact/toolbar";
import type { DateTimeSelection } from "../DateTimeDialog/DateTimeSelection.ts";

/**
 * Typ reprezentujący przedział czasowy rezerwacji.
 * 
 * @remarks
 * Składa się z dnia oraz godzin rozpoczęcia i zakończenia.
 * Godziny są oddzielnymi obiektami Date (wykorzystywane są tylko godziny i minuty).
 */
export type DateTimeSpan = {
    /** Dzień rezerwacji */
    day: Date,
    /** Godzina rozpoczęcia */
    startTime: Date,
    /** Godzina zakończenia */
    endTime: Date
};

/**
 * Właściwości komponentu DateTimeSelector.
 */
interface DateSelectionProps {
    /** Czy dialog wyboru czasu jest widoczny */
    visible: boolean;
    /** Callback do zmiany widoczności dialogu */
    setVisible: (x: boolean) => void;
    /** Aktualnie wybrany przedział czasowy */
    dayTime: DateTimeSpan;
    /** Callback do aktualizacji przedziału czasowego */
    setDayTime: (dateTimeSpan: DateTimeSpan) => void;

    /** Minimal reservation duration */
    minTime: number;

    /** Maximal reservation duration */
    maxTime: number;
}

/**
 * Komponent do wyboru dnia i przedziału czasowego rezerwacji.
 * 
 * @param props - Właściwości komponentu
 * 
 * @remarks
 * Komponent składa się z:
 * - Wyświetlacza pokazującego wybrany dzień i godziny
 * - Przycisku edycji otwierającego dialog {@link DateTimeDialog}
 * 
 * Walidacja:
 * - Godzina końca musi być późniejsza niż godzina startu
 * - Nie można wybrać dat w przeszłości
 * - Dla dzisiejszego dnia - godzina startu musi być w przyszłości
 * - TODO: Brak limitu czasu trwania rezerwacji
 * 
 * @example
 * ```tsx
 * const [visible, setVisible] = useState(false);
 * const [dayTime, setDayTime] = useState<DateTimeSpan>({
 *   day: new Date(),
 *   startTime: new Date(0, 0, 0, 8, 0),
 *   endTime: new Date(0, 0, 0, 16, 0)
 * });
 * 
 * <DateTimeSelector
 *   visible={visible}
 *   setVisible={setVisible}
 *   dayTime={dayTime}
 *   setDayTime={setDayTime}
 * />
 * ```
 */
export function DateTimeSelector(
    {
        visible,
        setVisible,
        dayTime,
        setDayTime,
        maxTime,
        minTime
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

        /* min-max reservation time */
        const duration =
            (endTime.getHours() * 60) + endTime.getMinutes() -
            (startTime.getHours() * 60) - startTime.getMinutes();

        if (duration < minTime || duration > maxTime) return false;

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