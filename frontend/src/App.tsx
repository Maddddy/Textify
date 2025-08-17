import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AppRouter from './components/AppRouter';
import './App.css';

function App() {
  const { isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="App">
      {isAuthenticated && (
        <header className="App-header">
          <h1>Textify Chatbot</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>
      )}
      <main className="App-main">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
