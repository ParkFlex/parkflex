import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";
import React from 'react';
import { TabMenu } from 'primereact/tabmenu';
// import {Button} from "primereact/button";

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
export function Layout(){


    const mobileStyles = `
    
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link {
        border-bottom: none;
        background-color: lightgrey;
        border-radius: 1.0rem ;
    }
    
     .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:hover {
        background-color: #ccccff;
        time-transition: background-color 0.5s ease;
        }
        
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link{
        background-color: #9999ff;
        time-transition: background-color 0.5s ease;
        color: black;
       
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
        margin-bottom: 2rem;
        
        }
        
        #logout .p-menuitem-link{
        background-color: #ff6666;
        color: white;
        }
        
        #logout .p-menuitem-icon{
        margin-right: 0;
        }
        
        #logout .p-menuitem-link:hover{
        background-color: #ff3333;
        
        }
        
        #content{
        margin: 1rem;
        }
    `;

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/Login');
    };

    const [activeIndex, setActiveIndex] = useState(() => {
        const path = window.location.pathname;
        if (path.includes('History')) return 1;
        if (path.includes('Report')) return 2;
        if (path.includes('Account')) return 3;
        return 0;
    });


    const items = [
        { label: '', icon: 'pi pi-sign-out', command: () => { logout();}, id: 'logout' },
        { label: 'Parking', icon: 'pi pi-car' , command: () => { navigate('/Parking'); setActiveIndex(0);}, },
        { label: 'Historia', icon: 'pi pi-history', command: () => { navigate('/History');setActiveIndex(1); } },
        { label: 'Zgłoszenia', icon: 'pi pi-ban', command: () => { navigate('/Report'); setActiveIndex(2);} },
        { label: 'Konto',  icon: 'pi pi-user', command: () => { navigate('/Account');setActiveIndex(3); } },
        // { label: 'Admin',  icon: 'pi pi-cog', command: () => { navigate('/Admin');setActiveIndex(3) } },


    ];

    return(
        <>
            <style>{mobileStyles}</style>
            <div className={'menu'} >
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}/>

            </div>
            <div id="content">
                <Outlet/>
            </div>

        </>
    );
}