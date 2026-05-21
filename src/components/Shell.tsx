import React from 'react';
import { account } from '../lib/appwrite';
import './Shell.css';

interface ShellProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function Shell({ children, onLogout }: ShellProps) {
  const handleSignOut = async () => {
    try {
      await account.deleteSession('current');
      onLogout();
    } catch (e) {
      console.error('Failed to sign out', e);
    }
  };

  return (
    <div className="shell-container">
      <header className="shell-taskbar">
        <div className="shell-brand">PropojOS</div>
        <div className="shell-actions">
          <button className="sign-out-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </header>
      <main className="shell-content">
        {children}
      </main>
    </div>
  );
}
