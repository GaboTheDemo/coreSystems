// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import LoginPage from './pages/Login/LoginPage';
import Home from './pages/Home/Home';
import SearchResultsPage from './components/SearchResultsPage/SearchResultsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import SellerRegister from './pages/SellerRegister/SellerRegister';
import SellerHome from './pages/SellerHome/SellerHome';
import Navbar from './components/Navbar/Navbar';

const AppLayout: React.FC = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/product/:slugOrId" element={<ProductDetailPage />} />
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <Routes>
            {/* Seller Home is completely standalone (no Navbar/cart) */}
            <Route path="/seller/home" element={<SellerHome />} />

            {/* Everything else goes through normal auth flow */}
            <Route
              path="*"
              element={
                !isAuthenticated
                  ? <LoginPage onSuccess={() => setIsAuthenticated(true)} />
                  : <AppLayout />
              }
            />
          </Routes>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;