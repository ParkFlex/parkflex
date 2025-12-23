import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import { useState } from "react";
import React from 'react';
 import { TabMenu } from 'primereact/tabmenu';
// import {Button} from "primereact/button";



export function Layout(){


    const mobileStyles = `
    
    .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link {
        border-bottom: none;
        background-color: lightgrey;
        border-radius: 20px ;
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
    `;

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/Login');
    }

    const [activeIndex, setActiveIndex] = useState(() => {
        const path = window.location.pathname;
        if (path.includes('History')) return 1;
        if (path.includes('Report')) return 2;
        if (path.includes('Account')) return 3;
        return 0;
    });


    const items = [
        { label: '', icon: 'pi pi-sign-out', command: () => { logout()}, id: 'logout' },
        { label: 'Parking', icon: 'pi pi-car' , command: () => { navigate('/Parking'); setActiveIndex(0)}, },
        { label: 'Historia', icon: 'pi pi-history', command: () => { navigate('/History');setActiveIndex(1) } },
        { label: 'Zgłoszenia', icon: 'pi pi-ban', command: () => { navigate('/Report'); setActiveIndex(2)} },
        { label: 'Konto',  icon: 'pi pi-user', command: () => { navigate('/Account');setActiveIndex(3) } },
        // { label: 'Admin',  icon: 'pi pi-cog', command: () => { navigate('/Admin');setActiveIndex(3) } },


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

