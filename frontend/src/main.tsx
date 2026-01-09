import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { PrimeReactProvider } from 'primereact/api';
import '@parkflex/themes/dist/theme.css';

import './index.css';

import { Admin } from './pages/Admin.tsx';
import { AdminParameters } from './pages/AdminParameters.tsx';
import { Layout } from './pages/Layout.tsx';
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { ParkingPage } from "./pages/Parking.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider value={{ ripple: true }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route path="/demo" element={<Demo/>}/>
                        <Route path="/history" element={<History/>}/>
                        <Route path="/parking" element={<ParkingPage/>}/>
                                            <Route path="/admin" element={<Admin/>}/>
                                            <Route path="/admin/parameters" element={<AdminParameters />} />
                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
);
