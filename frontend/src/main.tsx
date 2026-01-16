import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, Routes, BrowserRouter, Navigate } from "react-router";

import { PrimeReactProvider } from "primereact/api";
import "@parkflex/themes/dist/theme.css";

 import './index.css';
import { AdminParameters } from './pages/AdminParameters.tsx';
 import { Layout } from './pages/Layout.tsx';
import "./index.css";
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { Report } from "./pages/Report.tsx";
import { AdminHeaderAndSidebar } from "./components/AdminHeaderAndSidebar.tsx";
import { AdminUserList } from "./components/AdminUserList.tsx";
import { AdminHistoryList } from "./components/AdminHistoryList.tsx";
import { AdminReportList } from "./components/AdminReportList.tsx";
import { ParkingPage } from "./pages/Parking.tsx";
import { ArrivalPage } from "./pages/ArrivalPage.tsx";
import { LeavePage } from "./pages/LeavePage.tsx";
import { Register } from "./pages/Register.tsx";
import { AuthProvider } from "./components/auth";
import { Account } from "./pages/Account.tsx";
import { Login } from "./pages/Login.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider value={{ ripple: true }}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Navigate to="/parking" />} />
                            <Route path="/arrive/:token" element={<ArrivalPage/>}/>
                            <Route path="/leave/:token" element={<LeavePage/>}/>
                            <Route path="/parking" element={<ParkingPage />} />
                            <Route path="/demo" element={<Demo />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/report" element={<Report/>}/>
                            <Route path="/admin" element={<AdminHeaderAndSidebar />}>
                                <Route index element={<Navigate to="users" replace />} />
                                <Route path="users" element={<AdminUserList />} />
                                <Route path="reservation_history" element={<AdminHistoryList />} />
                                <Route path="report_history" element={<AdminReportList />} />
                                <Route path="settings" element={<AdminParameters />} />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </PrimeReactProvider>
    </StrictMode>
);
