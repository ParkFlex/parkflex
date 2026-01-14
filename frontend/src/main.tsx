import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Routes, BrowserRouter, Navigate } from "react-router";

import { PrimeReactProvider } from 'primereact/api';
import '@parkflex/themes/dist/theme.css';

import './index.css';
import { AdminParameters } from './pages/AdminParameters.tsx';
import { Layout } from './pages/Layout.tsx';
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { AdminHeaderAndSidebar } from "./components/AdminHeaderAndSidebar.tsx";
import { AdminUserList } from "./components/AdminUserList.tsx";
import { AdminHistoryList } from "./components/AdminHistoryList.tsx";
import { AdminReportList } from "./components/AdminReportList.tsx";
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
                        <Route path="/admin" element={<AdminHeaderAndSidebar />}>
                            <Route index element={<Navigate to="users" replace />} />
                            <Route path="users" element={<AdminUserList />} />
                            <Route path="reservation_history" element={<AdminHistoryList />} />
                            <Route path="report_history" element={<AdminReportList />} />
                            <Route path="settings" element={<AdminParameters />} />
                        </Route>
                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
);
