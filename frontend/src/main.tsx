import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { PrimeReactProvider } from "primereact/api";

import { Layout } from "./components/Layout.tsx";
import "./index.css";
import { NotFound } from "./pages/NotFound.tsx";
import { ParkingPage } from "./pages/reservation_view.tsx";

createRoot(document.getElementById("root")!).render(
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
);
