// src/App.tsx

import React, { useState } from 'react';
import Home from './pages/Home/Home';
import LoginPage from './pages/Login/LoginPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onSuccess={handleAuthSuccess} />;
  }

  return <Home />;
};

export default App;