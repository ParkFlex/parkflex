import {Sidebar} from "primereact/sidebar"; // Dostarcza gotowy komponent wysuwanego panelu bocznego
import {Button} from "primereact/button"; // tu buttona z prime reacta
import {useState} from "react"; // Hook - pozwala stronie "pamiętać" rzeczy
import { useNavigate } from "react-router"; // pozwala funkcji goTo na zmiane adresu na /admin/list i pokaż tamtą stronę bez odświeżania całego okna przeglądarki

export function AdminHeaderAndSidebar () {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const morski = '#5c7e7b';
    const jasnaZielen = '#d9e2db';

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
        <header style={{ // {} pierwszy to mowienie e teraz java, drui {} drugi to style css w js
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            backgroundColor: 'white',
            borderBottom: '2px solid ' + jasnaZielen
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                    icon="pi pi-bars"
                    onClick={open}
                    style={{ background: 'transparent', border: 'none', color: morski }}
                />
                <h2 style={{ margin: 0, color: morski, fontSize: '1.2rem' }}>Admin Panel</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Button
                    icon="pi pi-user"
                    onClick={function() { goTo('/admin/profile'); }}
                    style={{ background: 'transparent', border: 'none', color: morski }} />
                <Button
                    icon="pi pi-sign-out"
                    onClick={close}
                    style={{ background: 'transparent', border: 'none', color: morski }} />
            </div>

            <Sidebar visible={visible} onHide={close} position="left"> // co jest w środku nav to głowne menu strony/ praktyka dla porządku w kodzie podobno
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                    <Button
                        label="List"
                        icon="pi pi-list" //ikonki reacta
                        onClick={function() { goTo('/admin/list'); }}
                        style={{ background: 'transparent', border: 'none', color: morski, textAlign: 'left', justifyContent: 'flex-start' }}
                    />
                    <Button
                        label="Parameters"
                        icon="pi pi-cog"
                        onClick={function() { goTo('/admin/parameters'); }}
                        style={{ background: 'transparent', border: 'none', color: morski, textAlign: 'left', justifyContent: 'flex-start' }}
                    />
                    <Button
                        label="Spots"
                        icon="pi pi-map"
                        onClick={function() { goTo('/admin/spots'); }}
                        style={{ background: 'transparent', border: 'none', color: morski, textAlign: 'left', justifyContent: 'flex-start' }}
                    />
                </nav>
            </Sidebar>
        </header>
    );
}