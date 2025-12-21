import { Outlet } from "react-router";
import { useNavigate } from "react-router";
import React from 'react';
import { TabMenu } from 'primereact/tabmenu';
import {useStyle} from "primereact/hooks";

export function Layout(){
    let navigate = useNavigate();

    const mobileStyles = `
    // .p-menuitem-link: {
    // border-bottom: 2px solid #4b807b;
    // }
       .p-menuitem-link{
       // padding: 2px;
       border-bottom: none;
       }
         .p-tabmenu .p-tabmenu-nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        border-bottom: none;
        margin: 0;
        padding: 0;
         }
        
        .menu{
        margin-bottom:2rem;
        }
        
    `;

    const items = [
        { label: 'Parking', icon: 'pi pi-home' , command: () => { navigate('/Parking'); } },
        { label: 'Historia', icon: 'pi pi-chart-line', command: () => { navigate('/History'); } },
        { label: 'Zgłoszenia', icon: 'pi pi-list', command: () => { navigate('/Report'); } },
        {  icon: 'pi pi-user' }
    ];

    return(
        <>
            <style>{mobileStyles}</style>
            <div className={'menu'} >
                <TabMenu model={items} />
            </div>
            <Outlet/>
        </>
    );
}

