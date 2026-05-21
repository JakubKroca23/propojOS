import { useEffect, useState } from 'react';
import { account } from './lib/appwrite';
import { Login } from './pages/Login';
import { Shell } from './components/Shell';
import { Dashboard } from './components/Dashboard';
import './index.css';

import { WorkflowEditor } from './components/WorkflowEditor';
import { useOsStore } from './store/osStore';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { currentView, syncFromAppwrite } = useOsStore();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = await account.get();
      await syncFromAppwrite(user.$id);
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
    return <Login onLogin={checkSession} />;
  }

  return (
    <Shell onLogout={() => setIsAuthenticated(false)}>
      {currentView === 'dashboard' ? <Dashboard /> : <WorkflowEditor />}
    </Shell>
  );
}

export default App;
