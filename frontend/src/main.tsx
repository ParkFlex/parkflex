import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { PrimeReactProvider } from "primereact/api";

import "./index.css";
import { NotFound } from "./pages/NotFound.tsx";
import { ParkingPage } from "./pages/Parking.tsx";
import { Layout } from "./pages/Layout.tsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/parking" element={<ParkingPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>
);
