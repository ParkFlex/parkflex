import {Button} from "primereact/button";
import {useState} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AdminHeaderAndSidebar.css";

export function AdminHeaderAndSidebar() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: Integrate with actual logout API when available
        // For now, just navigate to home
        navigate("/");
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className={`admin-layout ${!sidebarVisible ? 'sidebar-collapsed' : ''}`}>
            {/* Header */}
            <header className="admin-header">
                <div className="header-left">
                    <Button 
                        icon="pi pi-bars" 
                        className="p-button-text header-toggle"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    />
                    <h1 className="brand">ParkFlex Admin</h1>
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <i className="pi pi-user"></i>
                        <span className="user-name">Administrator</span>
                    </div>
                    <Button 
                        label="Wyloguj" 
                        icon="pi pi-sign-out" 
                        className="p-button-text logout-button"
                        onClick={handleLogout}
                        aria-label="Logout"
                    />
                </div>
                {/* Mobile menu toggle */}
                <Button 
                    icon="pi pi-bars" 
                    className="p-button-text mobile-menu-toggle"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                />
            </header>

            {/* Sidebar */}
            <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                <nav className="sidebar-nav">
                    <NavLink 
                        to="/admin/dashboard" 
                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={closeMobileMenu}
                    >
                        <i className="pi pi-home"></i>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/spots" 
                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={closeMobileMenu}
                    >
                        <i className="pi pi-map-marker"></i>
                        <span>Miejsca parkingowe</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/reservations" 
                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={closeMobileMenu}
                    >
                        <i className="pi pi-calendar"></i>
                        <span>Rezerwacje</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/users" 
                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={closeMobileMenu}
                    >
                        <i className="pi pi-users"></i>
                        <span>Użytkownicy</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/penalties" 
                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={closeMobileMenu}
                    >
                        <i className="pi pi-exclamation-triangle"></i>
                        <span>Kary</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/settings" 
                        className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                        onClick={closeMobileMenu}
                    >
                        <i className="pi pi-cog"></i>
                        <span>Ustawienia</span>
                    </NavLink>
                </nav>
            </aside>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div 
                    className="mobile-overlay" 
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                ></div>
            )}

            {/* Main content area */}
            <main className="admin-content">
                <div className="content-wrapper">
                    {/* This is where the actual admin page content will be rendered */}
                    <h2>Witaj w panelu administracyjnym</h2>
                    <p>Wybierz opcję z menu, aby zarządzać systemem ParkFlex.</p>
                </div>
            </main>
        </div>
    );
}