// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider }        from './context/CartContext';
import { FavoritesProvider }   from './context/FavoritesContext';
import { ChatProvider }        from './context/ChatContext';
import { useChat }             from './context/ChatContext';
import LoginPage               from './pages/Login/LoginPage';
import AuthCallbackPage        from './pages/AuthCallback/AuthCallbackPage';
import Home                    from './pages/Home/Home';
import SearchResultsPage       from './components/SearchResultsPage/SearchResultsPage';
import ProductDetailPage       from './pages/ProductDetailPage/ProductDetailPage';
import SellerRegister          from './pages/SellerRegister/SellerRegister';
import SellerHome              from './pages/SellerHome/SellerHome';
import Navbar                  from './components/Navbar/Navbar';
import SellerChatWidget        from './components/SellerChatWidget/SellerChatWidget';
import ChatWidget              from './components/ChatWidget/ChatWidget';
import { getCurrentUser }      from './services/authService';
import { supabase }            from './lib/supabaseClient';
import type { User }           from './types';

/**
 * Layout principal para usuarios autenticados.
 * El SellerChatWidget se monta aquí: el contexto ya sabe si el usuario
 * es seller o buyer, así que el widget simplemente no se renderiza si es buyer
 * (o si no hay tienda asociada).
 */
const AppLayout: React.FC = () => {
  const { currentUserRole } = useChat();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/search"            element={<SearchResultsPage />} />
        <Route path="/product/:slugOrId" element={<ProductDetailPage />} />
        <Route path="/seller/register"   element={<SellerRegister />} />
        <Route path="*"                  element={<Navigate to="/" replace />} />
      </Routes>

      {/* Widget de chat según rol */}
      {currentUserRole === 'seller' && <SellerChatWidget />}
      {currentUserRole === 'buyer'  && <ChatWidget />}
    </>
  );
};

const App: React.FC = () => {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCurrentUser().then(u => {
      if (mounted) {
        setUser(u);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const u = await getCurrentUser();
        if (mounted) setUser(u);
      } else if (event === 'SIGNED_OUT') {
        if (mounted) setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 36, height: 36,
        border: '3px solid #e5e5e5',
        borderTop: '3px solid #1a1a1a',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          {/*
           * ChatProvider envuelve TODO lo que necesita el chat.
           * AppLayout consume useChat() para saber el rol del usuario
           * y montar el widget correcto.
           */}
          <ChatProvider>
            <Routes>
              {/* OAuth callback — siempre accesible */}
              <Route
                path="/auth/callback"
                element={<AuthCallbackPage onSuccess={setUser} />}
              />

              {/* SellerHome standalone (sin Navbar) */}
              <Route path="/seller/home" element={<SellerHome />} />

              {/* Login: redirige si ya hay sesión */}
              <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <LoginPage />}
              />

              {/* Todo lo demás: requiere sesión */}
              <Route
                path="*"
                element={user ? <AppLayout /> : <LoginPage />}
              />
            </Routes>
          </ChatProvider>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;