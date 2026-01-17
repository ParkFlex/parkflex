import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { PrimeReactProvider } from "primereact/api";
import "@parkflex/themes/dist/theme.css";

import './index.css';
import { AdminParameters } from './components/admin/AdminParameters.tsx';
import { Layout } from './pages/Layout.tsx';
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { Report } from "./pages/Report.tsx";
import { AdminHeaderAndSidebar } from "./components/admin/AdminHeaderAndSidebar.tsx";
import { AdminUserList } from "./components/admin/AdminUserList.tsx";
import { AdminHistoryList } from "./components/admin/AdminHistoryList.tsx";
import { AdminReportList } from "./components/admin/AdminReportList.tsx";
import { ParkingPage } from "./pages/Parking.tsx";
import { ArrivalPage } from "./pages/ArrivalPage.tsx";
import { LeavePage } from "./pages/LeavePage.tsx";
import { Register } from "./pages/Register.tsx";
import { AuthProvider } from "./components/auth";
import { Account } from "./pages/Account.tsx";
import { Login } from "./pages/Login.tsx";
import { HomePage } from "./pages/HomePage.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider value={{ ripple: true }}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/homepage" element={<HomePage/>}/>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<Layout />}>
                            <Route index element={<Navigate to="/homepage" />} />
                            <Route path="/arrive/:token" element={<ArrivalPage/>}/>
                            <Route path="/leave/:token" element={<LeavePage/>}/>
                            <Route path="/parking" element={<ParkingPage />} />
                            <Route path="/demo" element={<Demo />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/report" element={<Report/>}/>
                            <Route path="/admin" element={<AdminHeaderAndSidebar />}>
                                <Route index element={<Navigate to="users" replace />} />
                                <Route path="users" element={<AdminUserList />} />
                                <Route path="reservation_history" element={<AdminHistoryList />} />
                                <Route path="report_history" element={<AdminReportList />} />
                                <Route path="settings" element={<AdminParameters />} />
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </PrimeReactProvider>
    </StrictMode>
);
