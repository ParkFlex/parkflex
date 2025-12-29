import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { PrimeReactProvider } from 'primereact/api';
import '@parkflex/themes/dist/theme.css';

import "./index.css";
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { History } from "./pages/History.tsx";
import { ParkingPage } from "./pages/Parking.tsx";
import { Layout } from "./pages/Layout.tsx";
import { Register } from "./pages/Register.tsx";
import { AuthProvider } from "./components/auth";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider value={{ ripple: true }}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/parking" element={<ParkingPage />} />
                            <Route path="/demo" element={<Demo />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </PrimeReactProvider>
    </StrictMode>
);
