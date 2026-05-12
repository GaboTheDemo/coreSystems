// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import Home from './pages/Home/Home';
import SearchResultsPage from './components/SearchResultsPage/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import Navbar from './components/Navbar/Navbar';

// ── Layout con Navbar (dentro de BrowserRouter para poder usar useNavigate) ──
const AppLayout: React.FC = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/"                  element={<Home />} />
      <Route path="/search"            element={<SearchResultsPage />} />
      <Route path="/product/:slugOrId" element={<ProductDetailPage />} />
      <Route path="*"                  element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

// ── Root ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      {!isAuthenticated
        ? <LoginPage onSuccess={() => setIsAuthenticated(true)} />
        : <AppLayout />
      }
    </BrowserRouter>
  );
};

export default App;