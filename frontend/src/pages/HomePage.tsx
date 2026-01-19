import { LoginButtons } from "../components/LoginButtons";
import logoImg from "./logoZielonyBezNapisu.png";

export function HomePage() {
    const morski = '#5c7e7b';
    const jasnaZielen = '#d9e2db';

    function goTo(path: string) {
        window.location.assign(path); // assign zamiast href, aby umożliwić nawigację w historii przeglądarki
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: jasnaZielen,
            textAlign: 'center',
            padding: '20px'
        }}>
            <img
                src={logoImg}
                alt="ParkFlex Logo"
                style={{
                    width: '200px',
                    height: 'auto',
                    marginBottom: '20px',
                    filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 0.2))'
                }}
            />

            <h1 style={{ color: morski, fontSize: '2.8rem', margin: '0 0 10px 0' }}>
                ParkFlex
            </h1>

            <div style={{ width: '100%', maxWidth: '320px' }}>
                <LoginButtons
                    subText="Masz już konto?"
                    label="Zaloguj się"
                    color={morski}
                    onClick={() => goTo('/login')}
                />

                <LoginButtons
                    subText="Nie masz konta?!"
                    label="Zarejestruj się"
                    color={morski}
                    outlined // Przycisk obrysowany
                    onClick={() => goTo('/register')}
                />
            </div>
        </div>
    );
}