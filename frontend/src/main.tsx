import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {Route, Routes, BrowserRouter, Navigate} from "react-router";

import { PrimeReactProvider } from 'primereact/api';
import '../public/assets/mytheme/theme.scss';

import './index.css';
import { App } from './pages/App.tsx';
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { Admin } from "./pages/Admin.tsx"
import {AdminHeaderAndSidebar} from "./components/AdminHeaderAndSidebar.tsx";
import {AdminUserList} from "./components/AdminUserList.tsx";
import {AdminHistoryList} from "./components/AdminHistoryList.tsx";
import {AdminReportList} from "./components/AdminReportList.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/demo" element={<Demo/>}/>
                    <Route path="/history" element={<History/>}/>
                    <Route path="/admin" element={<AdminHeaderAndSidebar />}>
                        <Route index element={<Navigate to="users" replace />} />
                        <Route path="users" element={<AdminUserList />} />
                        <Route path="reservation_history" element={<AdminHistoryList />} />
                        <Route path="report_history" element={<AdminReportList />} />
                        {/*<Route path="settings" element={<AdminSettings />} />*/}
                    </Route>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
)
