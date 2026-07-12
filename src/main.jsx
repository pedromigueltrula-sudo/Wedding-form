import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import FotosBoda from './FotosBoda.jsx'
import './styles/main.css'
import './styles/fotosboda.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/fotosboda" element={<FotosBoda />} />
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
