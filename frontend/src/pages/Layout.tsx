import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";
import React from "react";

import { TabMenu } from "primereact/tabmenu";
import { useAuth } from "../hooks/useAuth";
import logoImg from "./logoZielonyBezNapisu.png";

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
        position: fixed;
        z-index: 1000;
        background-color: white;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        padding: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        justify-content: space-between;
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

        .menu-logo {
        height: 50px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        flex-shrink: 0;
        }

        .menu-logo img {
        height: 100%;
        width: auto;
        }

        .menu-logo h2 {
        margin: 0;
        color: #4b807b;
        font-size: 1.5rem;
        }

        .menu-nav {
        display: flex;
        justify-content: center;
        flex: 1;
        }

        .menu.collapsed {
        transform: translateY(-100%);
        transition: transform 0.3s ease-in-out;
        }

        .menu:not(.collapsed) {
        transform: translateY(0);
        transition: transform 0.3s ease-in-out;
        }

        .menu-expand-btn {
        display: none;
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999;
        background-color: #4b807b;
        color: white;
        border: none;
        border-radius: 0 0 12px 12px;
        width: 60px;
        height: 8px;
        padding: 8px 0;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0;
        }

        .menu-expand-btn::before {
        content: '';
        width: 40px;
        height: 4px;
        background-color: white;
        border-radius: 2px;
        }

        .menu-expand-btn:hover {
        background-color: #2d5055;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .menu.collapsed ~ .menu-expand-btn {
        display: flex;
        animation: slideDown 0.3s ease-in-out;
        }

        .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: none;
        }

        .menu:not(.collapsed) ~ .menu-overlay {
        display: block;
        }

        @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        }

        @media (max-width: 768px) {
            .menu {
                flex-direction: column;
                gap: 1rem;
                justify-content: center;
            }

            .menu-logo {
                width: 100%;
                justify-content: center;
            }

            .menu-nav {
                width: 100%;
            }

            .menu-logo h2 {
                display: none;
            }
        }
    `;

    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [activeIndex, setActiveIndex] = useState(() => {
        const path = window.location.pathname;
        const routes = ["history", "report", "account", "admin"];
        return routes.findIndex((r) => path.includes(r)) + 1;
    });
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

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
            label: "Rezerwacje",
            icon: "pi pi-calendar",
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
            <div className={`menu ${isHeaderCollapsed ? "collapsed" : ""}`}>
                <div className={"menu-logo"}>
                    <img src={logoImg} alt="ParkFlex" />
                    <h2>ParkFlex</h2>
                </div>
                <div className={"menu-nav"}>
                    <TabMenu
                        model={items}
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index)}
                    />
                </div>
            </div>
            <div 
                className="menu-overlay"
                onClick={() => setIsHeaderCollapsed(true)}
            />
            <button 
                className="menu-expand-btn"
                onClick={() => setIsHeaderCollapsed(false)}
                title="Rozwiń nagłówek"
            />
            <div id="content">
                <Outlet />
            </div>
        </>
    );
}
