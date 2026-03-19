import './index.css';
import React from 'react';
import Landing from './pages/Landing';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Landing />
    </AuthProvider>
  );
}

export default App;
