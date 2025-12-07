// Nagłówek wyświetla tytuł "Admin Panel" i przycisk do otwierania/zamykania menu

import React from 'react';

interface HeaderProps {
    onToggleSidebar: () => void; // Funkcja do przełączania sidebara (przekazana z Admin.tsx)
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            backgroundColor: '#333',
            color: 'white'
        }}>
            <h2>Admin Panel</h2>

            {/* Przycisk który otwiera/zamyka menu */}
            <button
                onClick={onToggleSidebar}
                style={{
                    padding: '10px 15px',
                    backgroundColor: '#555',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                ☰ Menu
            </button>
        </header>
    );
};

export default Header;