import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { PrimeReactProvider } from 'primereact/api';
import '@parkflex/themes/dist/theme.css';

import './index.css';
import { Layout } from './pages/Layout.tsx';
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { Report } from "./pages/Report.tsx";
import { ParkingPage } from "./pages/Parking.tsx";
import { ArrivalPage } from "./pages/ArrivalPage.tsx";
import { LeavePage } from "./pages/LeavePage.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider value={{ ripple: true }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route path="/arrive/:token" element={<ArrivalPage/>}/>
                        <Route path="/leave/:token" element={<LeavePage/>}/>
                        <Route path="/demo" element={<Demo/>}/>
                        <Route path="/history" element={<History/>}/>
                        <Route path="/parking" element={<ParkingPage/>}/>
                        <Route path="/report" element={<Report/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
);
