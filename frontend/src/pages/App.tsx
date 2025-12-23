import { useState } from 'react';
import '../App.css';

import { Button } from "primereact/button";
import { formatDateWeek, formatTime } from "../utils/dateUtils.ts";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { DateTimeDialog } from "../components/DateTimeDialog";
import { DateTimeSelection } from "../components/DateTimeDialog/DateTimeSelection.ts";

export function App() {
    const [simpleVisible, setSimpleVisible] = useState(false);
    const [rangeVisible, setRangeVisible] = useState(false);
    const [singleVisible, setSingleVisible] = useState(false);

    const [externalState, setExternalState] = useState(DateTimeSelection.initial("single"));

    const [msg, setMsg] = useState("");

    const toMsg = ({ days, startTime, endTime }: DateTimeSelection<"single">) =>
        `${formatDateWeek(days)}, ${formatTime(startTime!)} - ${formatTime(endTime!)}`;

    return (
        <>
            <Message text={msg}/>

            <Divider/>

            <Message text={toMsg(externalState)}/>

            <Divider/>

            <Button onClick={() => setSimpleVisible(true)}>Simple single</Button>
            <Button onClick={() => setRangeVisible(true)}>Range autoclose</Button>
            <Button onClick={() => setSingleVisible(true)}>Single autoclose</Button>

            <DateTimeDialog
                header={"Wybierz datę i czas"}
                visible={simpleVisible}
                selectionMode="single"
                initialSelection={externalState}
                onApply={ selection => {
                    setExternalState(selection);
                    setSimpleVisible(false);
                }}
                onHide={() => setSimpleVisible(false)}
            />

            <DateTimeDialog
                header="Wybierz zakres dat"
                selectionMode="range"
                visible={rangeVisible}
                onClear={() => console.log("clear")}
                isValid={ xs => (xs !== null && xs.days.length === 2 && xs.days[0] !== null && xs.days[1] !== null) }
                onSelectionChange={ console.log }
                showTimeSelect={false}
                autoCloseOnDaySelect={true}
                onHide={() => setRangeVisible(false)}
                onApply={({ days, startTime, endTime }) => {
                    const startMsg = startTime === null ? "null" : formatTime(startTime);
                    const endMsg = endTime === null ? "null" : formatTime(endTime);
                    const startDayMsg = days[0] === null ? "null" : formatDateWeek(days[0]);
                    const endDayMsg = days[0] === null ? "null" : formatDateWeek(days[0]);

                    setMsg(`Przedział od ${startDayMsg} do ${endDayMsg}, ${startMsg} - ${endMsg}`);

                    setRangeVisible(false);
                }}
            />

            <DateTimeDialog
                header="Wybierz datę i przedzial godzin"
                selectionMode="single"
                autoCloseOnDaySelect={true}
                visible={singleVisible}
                onClear={() => console.log("clear")}
                isValid={ x => !(x === null || x.days.getTime() < (new Date()).getTime()) }
                onHide={() => setSingleVisible(false)}
                onApply={({ days, startTime, endTime }) => {
                    if (startTime !== null && endTime !== null)
                        setMsg(`W dniu ${formatDateWeek(days)}, ${formatTime(startTime)} - ${formatTime(endTime)}`);
                    setSingleVisible(false);
                }}
            />
        </>
    );
}
