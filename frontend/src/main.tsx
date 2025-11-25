import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Route, Routes, BrowserRouter} from "react-router";

import {PrimeReactProvider} from 'primereact/api';
import "primereact/resources/themes/md-light-indigo/theme.css";

import './index.css';
import {App} from './pages/App.tsx';
import {Demo} from "./pages/Demo.tsx";
import {NotFound} from "./pages/NotFound.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PrimeReactProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/demo" element={<Demo/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </PrimeReactProvider>
    </StrictMode>
)
