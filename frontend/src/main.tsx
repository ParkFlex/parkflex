import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { PrimeReactProvider } from "primereact/api";
import '../public/assets/mytheme/theme.scss';

import "./index.css";
import { Demo } from "./pages/Demo.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { ParkingPage } from "./pages/Parking.tsx";
import { Layout } from "./pages/Layout.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path="/parking" element={<ParkingPage/>}/>
                        <Route path="/demo" element={<Demo/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
);
