import { useEffect, useState } from 'react';
import { account } from './lib/appwrite';
import { Login } from './pages/Login';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      await account.get();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await account.deleteSession('current');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to PropojOS</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Your personal native web operating system.
      </p>
      <button 
        onClick={handleLogout}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--panel-bg)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default App;
