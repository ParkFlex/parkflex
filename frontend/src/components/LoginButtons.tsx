import { Button } from "primereact/button";

export function LoginButtons({ label, subText, onClick, outlined, color }: any)//any oznacza, że dowolny typ danych może być przekazany jako właściwość
{
    return (
        <div style={{ marginTop: '20px', width: '100%' }}>
            <p style={{ color: color, marginBottom: '10px', fontWeight: '500' }}>
                {subText} {/* Tekst pod przyciskiem */}
            </p>
            <Button
                label={label}
                onClick={onClick}
                className={outlined ? "p-button-outlined" : ""} // Dodaje klasę obrysowaną, jeśli outlined jest prawdziwe
                style={{
                    width: '100%',
                    backgroundColor: outlined ? 'transparent' : color, // Tło przycisku
                    color: outlined ? color : 'white',
                    borderColor: color,
                    borderRadius: '8px'
                }}
            />
        </div>
    );
}