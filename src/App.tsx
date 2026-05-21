import { useEffect, useState } from 'react';
import { account } from './lib/appwrite';
import { Login } from './pages/Login';
import { Shell } from './components/Shell';
import { Dashboard } from './components/Dashboard';
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

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Shell onLogout={() => setIsAuthenticated(false)}>
      <Dashboard />
    </Shell>
  );
}

export default App;
