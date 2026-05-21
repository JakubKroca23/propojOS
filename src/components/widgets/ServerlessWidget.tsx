import React, { useState, useEffect, useRef } from 'react';
import { useAppInput } from '../../hooks/useAppEvent';
import { functions } from '../../lib/appwrite';

export function ServerlessWidget({ id }: { id: string }) {
  const input = useAppInput(id, 'in');
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '👾 Appwrite Serverless Runner initialized.',
    '🔌 Draw a connection in the Flow Editor to map inputs here.'
  ]);
  const lastProcessedRef = useRef<any>(null);
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console log
  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [executionLogs]);

  // Listen to input changes reactively
  useEffect(() => {
    if (input !== undefined && input !== lastProcessedRef.current) {
      lastProcessedRef.current = input;
      triggerServerlessFunction(input);
    }
  }, [input]);

  const triggerServerlessFunction = async (payload: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setExecutionLogs((prev) => [
      ...prev,
      `[${timestamp}] 🚀 Triggered by Event Bus! Input Payload: ${JSON.stringify(payload)}`
    ]);

    try {
      // Standard production Appwrite SDK execution call
      const execution = await functions.createExecution(
        'event-processor',
        JSON.stringify({ value: payload })
      );

      const successTime = new Date().toLocaleTimeString();
      setExecutionLogs((prev) => [
        ...prev,
        `[${successTime}] ✅ Execution Success! Appwrite Response:`,
        `  ➔ ${execution.responseBody}`
      ]);
    } catch (err: any) {
      // Highly robust fallback mockup if the Appwrite Function isn't deployed yet
      const fallbackTime = new Date().toLocaleTimeString();
      setExecutionLogs((prev) => [
        ...prev,
        `[${fallbackTime}] ⚠️ Appwrite SDK Function not found/deployed. Running simulation...`,
        `[${fallbackTime}] ⚡ Mock Event-Processor Output:`,
        `  { "input": ${JSON.stringify(payload)}, "result": "${typeof payload === 'number' ? payload * 2 : String(payload).toUpperCase()}", "status": "processed", "node": "Appwrite Serverless Fn" }`
      ]);
    }
  };

  const clearConsole = () => {
    setExecutionLogs(['👾 Console cleared. Waiting for event inputs...']);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'rgba(5, 8, 16, 0.4)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      {/* Console toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.4rem 0.8rem',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#8892b0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
          Serverless Logs
        </span>
        <button 
          onClick={clearConsole}
          style={{
            background: 'none',
            border: 'none',
            color: '#2f81f7',
            fontSize: '0.7rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(47, 129, 247, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Clear
        </button>
      </div>

      {/* Terminal log window */}
      <div style={{
        flex: 1,
        padding: '0.75rem',
        overflowY: 'auto',
        fontFamily: 'Consolas, Monaco, "Lucida Console", "Liberation Mono", monospace',
        fontSize: '0.8rem',
        lineHeight: '1.4',
        color: '#a8b2d1',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        {executionLogs.map((log, index) => {
          let logColor = '#a8b2d1';
          if (log.includes('✅')) logColor = '#4eec80';
          if (log.includes('🚀')) logColor = '#64ffda';
          if (log.includes('⚠️') || log.includes('Mock')) logColor = '#ffc83b';
          if (log.includes('👾')) logColor = '#2f81f7';
          
          return (
            <div key={index} style={{ color: logColor, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {log}
            </div>
          );
        })}
        <div ref={consoleBottomRef} />
      </div>
    </div>
  );
}
