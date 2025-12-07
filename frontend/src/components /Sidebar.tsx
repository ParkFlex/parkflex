// Menu Nawigacyjne wyświetla listę wszystkich dostępnych widoków (np. Users, Spots, Settings).

import React from 'react';

// Definicja wszystkich widoków, które admin może zobaczyć
export type AdminViewType =
    | 'users' // lista użytkowników
    | 'spots' // widok miejsc w dowolnej godzinie
    | 'history'
    | 'violations'
    | 'settings'; // parametry

interface SidebarProps {
    isOpen: boolean;
    onViewSelect: (view: AdminViewType) => void;
    activeView: AdminViewType;
}

const adminViews: { name: string, type: AdminViewType }[] = [
    { name: 'Lista użytkowników', type: 'users' },
    { name: 'Spots - widok miejsc', type: 'spots' },
    { name: 'Historia rezerwacji', type: 'history' },
    { name: 'Historia "wykroczeń"', type: 'violations' },
    { name: 'Konfiguracja Parametrów', type: 'settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onViewSelect, activeView }) => {
    return (
        <aside style={{
            width: isOpen ? '250px' : '0',
            height: '100vh',
            backgroundColor: '#444',
            color: 'white',
            position: 'fixed',
            top: 0,
            left: 0,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            zIndex: 100
        }}>
            <nav style={{ padding: '20px 0' }}>
                <ul>
                    {adminViews.map((view) => (
                        <li
                            key={view.type}
                            style={{
                                listStyle: 'none',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                backgroundColor: activeView === view.type ? '#555' : 'transparent'
                            }}
                            onClick={() => onViewSelect(view.type)}
                        >
                            {view.name}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;