import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";
import React from 'react';
 import { TabMenu } from 'primereact/tabmenu';
// import {Button} from "primereact/button";



export function Layout(){


    const mobileStyles = `
    
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link, .p-button-logout {
        border-bottom: none;
        background-color: lightgrey;
        border-radius: 20px ;
       
       
    }
    
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link{
        background-color: #9999ff;
        time-transition: background-color 0.5s ease;
       
    }
    
    
    .p-button-logout{
        padding: 20px;
        }
       
         .p-tabmenu .p-tabmenu-nav, .p-button-logout {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        justify-content: center;
       border-bottom: none;
        margin: 5px 0;
        padding: 0;
        
         }
        
        .menu{
        border-bottom: 2px solid #4b807b;
        border-radius: 20px ;
        padding-bottom: 10px;
        margin-bottom:2rem;
        }
        
    `;

    let navigate = useNavigate();

    // const logout = () => {
    //     localStorage.removeItem('authToken');
    //     navigate('/login');
    // }

    const [activeIndex, setActiveIndex] = useState(() => {
        const path = window.location.pathname;
        if (path.includes('History')) return 1;
        if (path.includes('Report')) return 2;
        if (path.includes('Settings')) return 3;
        return 0;
    });


    const items = [
        { label: 'Parking', icon: 'pi pi-car' , command: () => { navigate('/Parking'); setActiveIndex(0)}, },
        { label: 'Historia', icon: 'pi pi-history', command: () => { navigate('/History');setActiveIndex(1) } },
        { label: 'Zgłoszenia', icon: 'pi pi-ban', command: () => { navigate('/Report'); setActiveIndex(2)} },
        { label: 'Ustawienia',  icon: 'pi pi-user', command: () => { navigate('/Settings');setActiveIndex(3) } },
        // {
        //     template: () => (
        //         <Button icon="pi pi-sign-out" className="p-button-logout" onClick={logout}/>
        //     )
        //
        // },
    ];

    return(
        <>
            <style>{mobileStyles}</style>
            <div className={'menu'} >
                <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}/>

            </div>
            <Outlet/>
        </>
    );
}

