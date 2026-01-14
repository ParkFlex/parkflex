import { Sidebar } from "primereact/sidebar"; // Dostarcza gotowy komponent wysuwanego panelu bocznego
import { Button } from "primereact/button"; // tu buttona z prime reacta
import { useState } from "react"; // Hook - pozwala stronie "pamiętać" rzeczy
import { useNavigate, useLocation } from "react-router"; // pozwala funkcji goTo na zmiane adresu na /admin/list i pokaż tamtą stronę bez odświeżania całego okna przeglądarki
import { Outlet } from "react-router";

export function AdminHeaderAndSidebar () {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const morski = '#5c7e7b';
    const jasnaZielen = '#d9e2db';

    const getHeaderTitle = () => {
        const path = location.pathname;
        switch (true) {
            case path.includes('/admin/users'):
                return 'Lista Użytkowników';
            case path.includes('/admin/reservation_history'):
                return 'Historia Rezerwacji';
            case path.includes('/admin/report_history'):
                return 'Historia Zgłoszeń';
            case path.includes('/admin/settings'):
                return 'Ustawienia Admina';
            default:
                return 'Lista Użytkowników';
        }
    };

    function open() {
        setVisible(true);
    }

    function close() {
        setVisible(false);
    }

    function goTo(path: string) {
        navigate(path);
        close();
    }

    return (
        <div>
            <header style={{ // {} pierwszy to mowienie e teraz java, drui {} drugi to style css w js
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 20px',
                backgroundColor: 'white',
                borderBottom: '2px solid ' + jasnaZielen
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <Button
                        icon="pi pi-bars"
                        onClick={open}
                        style={{ background: 'transparent', border: 'none', color: morski }}
                    />
                    <h2 style={{ margin: 0, color: morski, fontSize: '1.2rem' }}>{getHeaderTitle()}</h2>
                </div>

                <Sidebar visible={visible} onHide={close} position="left">
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                        <Button
                            label="Lista Użytkowników"
                            icon="pi pi-users" //ikonki reacta
                            onClick={function() { goTo('/admin/users'); }}
                            style={{ background: 'transparent', border: 'none', color: morski, textAlign: 'left', justifyContent: 'flex-start' }}
                        />
                        <Button
                            label="Historia Rezerwacji"
                            icon="pi pi-calendar"
                            onClick={function() { goTo('/admin/reservation_history'); }}
                            style={{ background: 'transparent', border: 'none', color: morski, textAlign: 'left', justifyContent: 'flex-start' }}
                        />
                        <Button
                            label="Historia Zgłoszeń"
                            icon="pi pi-megaphone"
                            onClick={function() { goTo('/admin/report_history'); }}
                            style={{ background: 'transparent', border: 'none', color: morski, textAlign: 'left', justifyContent: 'flex-start' }}
                        />
                        <Button
                            label="Ustawienia Admina"
                            icon="pi pi-user-edit"
                            onClick={function() { goTo('/admin/settings'); }}
                            style={{ background: 'transparent', border: 'none', color: morski, textAlign: 'left', justifyContent: 'flex-start' }}
                        />
                    </nav>
                </Sidebar>
            </header>
            <Outlet />
        </div>
    );
}