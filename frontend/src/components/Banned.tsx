import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const ErrorBanned = ({
  days,
  reason,
  charge,
  onPay,
  onWait,
}: {
  days: number;
  reason: string;
  charge: number;
  onPay: (code: string) => void;
  onWait: () => void;
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
        Twoje konto zostało zablokowane z powodu {reason}.
        <br />
        Pozostały czas blokady to : {days} {days === 1 ? "dzień" : "dni"}.
        <br />
        Opłata za wcześniejsze odblokowanie konta wynosi {charge} PLN.
      </p>

      <Card className="banned-buttons">
        {!showPayment && (
          <Button label="Opłać blokadę" onClick={() => setShowPayment(true)} />
        )}
        {!showPayment && (
          <Button
            label="Wolę poczekać"
            onClick={onWait}
            style={{ marginLeft: "10px" }}
          />
        )}

        {showPayment && (
          <Card style={{ marginTop: "20px" }}>
            <InputText
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const v = e.target.value;
                if (!isNaN(Number(v))) setCode(v);
              }}
              placeholder="Wpisz kod 6-cyfrowy płatności"
              style={{ width: "250px" }}
            />
            <Button
              label="Zapłać"
              onClick={handlePay}
              style={{ marginLeft: "10px" }}
            />
          </Card>
        )}
      </Card>
    </Card>
  );
};
