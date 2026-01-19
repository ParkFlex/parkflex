import {useState} from "react";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {formatDate} from "../utils/dateUtils.ts";
import {Dialog} from "primereact/dialog";
import {ConfirmDialog} from "primereact/confirmdialog";
import {FloatLabel} from "primereact/floatlabel";

/**
 * Komponent wyświetlający ekran blokady konta użytkownika.
 *
 * @param props - Właściwości komponentu
 * @param props.days - Liczba dni pozostałych do końca blokady
 * @param props.reason - Powód zablokowania konta
 * @param props.charge - Kwota opłaty za wcześniejsze odblokowanie (w PLN)
 * @param props.onPay - Callback wywoływany po opłaceniu blokady z kodem płatności
 *
 * @remarks
 * Komponent umożliwia użytkownikowi:
 * - Wyświetlenie powodu i czasu trwania blokady
 * - Opłacenie blokady przez podanie 6-cyfrowego kodu
 * - Rezygnację z opłaty i oczekiwanie na automatyczne odblokowanie
 *
 * Walidacja:
 * - Kod płatności musi mieć dokładnie 6 cyfr
 * - Akceptowane są tylko znaki numeryczne
 *
 * @example
 * ```tsx
 * <ErrorBanned
 *   days={3}
 *   reason="przekroczenie limitu rezerwacji"
 *   charge={150}
 *   onPay={(code) => console.log('Opłacono kodem:', code)}
 * />
 * ```
 */
export const ErrorBanned = ({
                                due,
                                reason,
                                charge,
                                onPay,
                            }: {
    due: Date;
    reason: string;
    charge: number;
    onPay: (code: string) => void;
}) => {
    const [showPayment, setShowPayment] = useState(false);
    const [code, setCode] = useState("");

    const handlePay = () => {
        if (code.length !== 6) {
            alert("Nieprawidłowy kod płatności. Kod powinien mieć 6 znaków.");
            return;
        }
        onPay(code);
    };
    return (
        <Card className="banned-page" title="Dostęp został zablokowany">
            <p>
                Twoje konto zostało zablokowane z następującego powodu: {reason}.
                <br/>
                Blokada jest aktywna do: {formatDate(due)}
                <br/>
                Opłata za wcześniejsze odblokowanie konta wynosi {charge} PLN.
            </p>

            <Card className="banned-buttons">
                {!showPayment && (
                    <Button label="Opłać blokadę" onClick={() => setShowPayment(true)}/>
                )}

                <ConfirmDialog
                    header={<span style={{fontSize: "1.25rem"}}>Opłać blokadę</span>}
                    headerStyle={{paddingBottom: "0.5em"}}
                    visible={showPayment}
                    onHide={() => setShowPayment(false)}
                    contentStyle={{paddingTop: "1.5rem", paddingBottom: "1rem"}}
                    acceptLabel={"Zapłać"}
                    accept={handlePay}
                    rejectLabel={"Anuluj"}
                    message={
                        <FloatLabel>
                            <InputText
                                id="payment-input"
                                type="text"
                                maxLength={6}
                                value={code}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (!isNaN(Number(v))) setCode(v);
                                }}
                                style={{border: "1px solid"}}
                            />
                            <label htmlFor="payment-input">6-cyfrowy kod płatności</label>
                        </FloatLabel>
                    }
                />
            </Card>
        </Card>
    );
};
