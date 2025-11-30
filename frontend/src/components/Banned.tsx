import {useState}from "react"

export const ErrorBanned = ({days, reason,charge,onPay,onWait}:{days: number; reason: string; charge: number; onPay:(code:string)=>void; onWait:()=>void}) => {
    const [showPayment, setShowPayment] = useState(false);
    const [code,setCode] = useState("");

    const handlePay = () => {
        if(code.length!==6){
            alert("Nieprawidłowy kod płatności. Kod powinien mieć 6 znaków.");
            return;
        }
        onPay(code);
    };
    return (
    <div className="banned-page">
        <h1>Dostęp został zablokowany</h1>
        <p>Twoje konto zostało zablokowane z powodu {reason}.
        <br/>Pozostały czas blokady to : {days} {days ===1 ?"dzień" : "dni"}.
        <br/>Opłata za wcześniejsze odblokowanie konta wynosi {charge} PLN.</p>

        <div className="banned-buttons">
            {!showPayment &&( <button onClick={()=>setShowPayment(true)}>Opłać blokadę</button>)}
            {!showPayment && (<button onClick={onWait} style={{marginLeft: "10px"}}>Wolę poczekać</button>)}
        
    {showPayment &&( <div style={{marginTop:"20px"}}>
        <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => {
                const v = e.target.value;
                if (!isNaN(Number(v))) setCode(v);
            }}
            placeholder="Wpisz kod 6-cyfrowy płatności"
            style={{width: "190px"}}
        />
        <button onClick={handlePay} style={{marginLeft: "10px"}}>Zapłać</button>
    </div>
            )}
    </div>
    </div>
    );
}