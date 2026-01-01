import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Routes, BrowserRouter } from "react-router";

import { PrimeReactProvider } from 'primereact/api';
import '../public/assets/mytheme/theme.scss';

import './index.css';
import { App } from './pages/App.tsx';
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { Admin } from "./pages/Admin.tsx"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/demo" element={<Demo/>}/>
                    <Route path="/history" element={<History/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
)
