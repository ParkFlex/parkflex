import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router";

import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/md-light-indigo/theme.css";

import './index.css';
import { App } from './pages/App.tsx';
import { NotFound } from "./pages/NotFound.tsx";
import { ReservationPage } from './pages/reservation_view.tsx';

createRoot(document.getElementById('root')!).render(
    <PrimeReactProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/view" element={<ReservationPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    </PrimeReactProvider>
)
