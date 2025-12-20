import '../styles/admin.css'; //  import decyduje o zaaplikowaniu styli
import {Sidebar} from "primereact/sidebar";
import {Button} from "primereact/button";
import {useState} from "react";
import { useNavigate } from "react-router";

export function AdminHeaderAndSidebar () {
    const [visible, setVisible] =  useState(false); //widoczność sidebaru
    const navigate = useNavigate();

    const open = () => setVisible(true); // header button opens sidebar
    const close = () => setVisible(false); //zamyka

    const goTo = (path: string) => {
        navigate(path);
        close();
    }

    return (
        <header className="admin-header card flex align-items-center justify-content-between">
            <div className="header-left flex align-items-center">
                <Button icon="pi pi-bars" className="p-button-text p-button-plain" aria-label="Open menu" onClick={open} />
                <h2 className="app-title" style={{margin: '0 0 0 0.5rem'}}>Admin Panel</h2>
            </div>

            <div className="header-right flex align-items-center">
                <Button icon="pi pi-user" className="p-button-text p-button-plain" aria-label="Profile" onClick={() => goTo('/admin/profile')} />
                <Button icon="pi pi-sign-out" className="p-button-text p-button-plain" aria-label="Logout" onClick={() => { /* placeholder logout */ navigate('/'); }} />
            </div>

            <Sidebar visible={visible} onHide={close} position="left" showCloseIcon>
                <nav className="admin-sidebar flex flex-column gap-2">
e                    <Button label="List" icon="pi pi-list" className="p-button-text p-button-plain" onClick={() => { close(); }} aria-label="List (no navigation)" />
                    <Button label="Parameters" icon="pi pi-cog" className="p-button-text p-button-plain" onClick={() => { close(); }} aria-label="Parameters (no navigation)" />
                    <Button label="Spots" icon="pi pi-map" className="p-button-text p-button-plain" onClick={() => { close(); }} aria-label="Spots (no navigation)" />
                </nav>
            </Sidebar>
        </header>
    )
}