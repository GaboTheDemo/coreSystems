// src/App.tsx

import React, { useState } from "react";

import Home from "./pages/Home/Home";
import LoginPage from "./pages/Login/LoginPage";
import Cart from "./pages/Cart/Cart";
import { CartProvider } from "./context/CartContext";

type Route = "home" | "cart";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [route, setRoute] = useState<Route>("home");

  const handleAuthSuccess = (): void => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <CartProvider>
        <LoginPage onSuccess={handleAuthSuccess} />
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      {route === "cart" ? (
        <Cart
          onExploreProducts={() => setRoute("home")}
          onContinueShopping={() => setRoute("home")}
        />
      ) : (
        <Home onCartClick={() => setRoute("cart")} />
      )}
    </CartProvider>
  );
};

export default App;
