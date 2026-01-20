import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";
import React from "react";

import { TabMenu } from "primereact/tabmenu";
import { useAuth } from "../hooks/useAuth";

/**
 * Komponent Layout - główny układ aplikacji z nawigacją.
 *
 * @remarks
 * Komponent opakowujący wszystkie strony aplikacji, zapewniający:
 * - Sticky menu nawigacyjne u góry ekranu
 * - Zakładki: Parking, Historia, Zgłoszenia, Konto
 * - Przycisk wylogowania
 * - Outlet dla zagnieżdżonych routów
 *
 * Menu jest responsywne i dostosowuje się do urządzeń mobilnych.
 * Style są wstrzykiwane inline przez <style> tag.
 *
 * TODO: Niektóre linki (Report, Account, Admin) prowadzą do nieistniejących stron.
 *
 * Funkcjonalności:
 * - Automatyczne ustawienie aktywnej zakładki na podstawie URL
 * - Wylogowanie przez usunięcie authToken z localStorage
 * - Nawigacja między sekcjami aplikacji
 *
 * @example
 * ```tsx
 * <Route path="/" element={<Layout />}>
 *   <Route path="parking" element={<ParkingPage />} />
 *   <Route path="history" element={<History />} />
 * </Route>
 * ```
 */
export function Layout() {

    const morski = '#4b807b';
    const jasnaZielen = '#d4e2da';

    const mobileStyles = `
    
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link {
        border-bottom: none;
        background-color: #d4e2da;
        border-radius: 1.0rem ;
        color: #4b807b;
    }
    
     .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:hover {
        background-color: #4b807b;
        color: white;
        time-transition: background-color 0.5s ease;
        }
        
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link{
        background-color: #4b807b;
        time-transition: background-color 0.5s ease;
        color: white;
       
    }
    
    
    
       
         .p-tabmenu .p-tabmenu-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
        justify-content: center;
       border-bottom: none;
        margin: 0.3rem 0;
        padding: 0;
        
         }
        
        .menu{
        position: sticky;
        z-index: 1000;
        background-color: white;
        top: 0;
        width: 100%;
        border-bottom: 0.1rem solid #4b807b;
        border-radius: 0 0 2rem 2rem;
        padding: 1rem;
        }
        
        #logout .p-menuitem-link{
        background-color: rgb(255, 100.29, 88.95);
        color: white;
        }
        
        #logout .p-menuitem-icon{
        margin-right: 0;
        }
        
        #logout .p-menuitem-link:hover{
        background-color: #ff3333;
        
        }
    `;

    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [activeIndex, setActiveIndex] = useState(() => {
        const path = window.location.pathname;
        const routes = ["history", "report", "account", "admin"];
        return routes.findIndex((r) => path.includes(r)) + 1;
    });

    const items = [
        {
            label: "Parking",
            icon: "pi pi-car",
            command: () => {
                navigate("/parking");
                setActiveIndex(0);
            },
        },
        {
            label: "Historia",
            icon: "pi pi-history",
            command: () => {
                navigate("/history");
                setActiveIndex(1);
            },
        },
        {
            label: "Zgłoszenia",
            icon: "pi pi-ban",
            command: () => {
                navigate("/report");
                setActiveIndex(2);
            },
        },
        {
            label: "Konto",
            icon: "pi pi-user",
            command: () => {
                navigate("/account");
                setActiveIndex(3);
            },
        },
        {
            label: "Admin",
            icon: "pi pi-cog",
            command: () => {
                navigate("/admin");
                setActiveIndex(4);
            },
            visible: user?.role === "admin",
        },
        {
            label: "",
            icon: "pi pi-sign-out",
            command: () => {
                logout();
                navigate("/");
            },
            id: "logout",
            visible: isAuthenticated,
        },
    ];

    return (
        <>
            <style>{mobileStyles}</style>
            <div className={"menu"}>
                <TabMenu
                    model={items}
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                />
            </div>
            <div style={{
                marginLeft: "2%",
                marginRight: "2%",
                marginTop: "2%",
                marginBottom: "2%",
            }} id="content">
                <Outlet />
            </div>
        </>
    );
}
