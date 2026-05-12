// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';   // ← IMPORTAR
import LoginPage from './pages/Login/LoginPage';
import Home from './pages/Home/Home';
import SearchResultsPage from './components/SearchResultsPage/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import Navbar from './components/Navbar/Navbar';

const AppLayout: React.FC = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/product/:slugOrId" element={<ProductDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <CartProvider>   {/* ← ENVOLVER AQUÍ */}
        {!isAuthenticated
          ? <LoginPage onSuccess={() => setIsAuthenticated(true)} />
          : <AppLayout />
        }
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;