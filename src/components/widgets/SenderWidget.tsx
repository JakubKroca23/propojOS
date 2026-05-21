import React, { useState } from 'react';
import { useAppOutput } from '../../hooks/useAppEvent';

export function SenderWidget({ id }: { id: string }) {
  const emit = useAppOutput(id, 'out');
  const [val, setVal] = useState<number | string>('None');

  const handleSend = () => {
    const newVal = Math.floor(Math.random() * 100);
    setVal(newVal);
    emit(newVal);
  };

  return (
    <div style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>Last sent: {val}</p>
      <button 
        onClick={handleSend} 
        style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Emit Random Number
      </button>
    </div>
  );
}
