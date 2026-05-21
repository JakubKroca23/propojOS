import React, { Suspense, useEffect, useState } from 'react';
import { __federation_method_setRemote, __federation_method_getRemote } from 'virtual:__federation__';

interface PluginLoaderProps {
  url: string;
  moduleName: string; // e.g. 'remoteApp'
  componentName: string; // e.g. './App' or './Widget'
}

export function PluginLoader({ url, moduleName, componentName }: PluginLoaderProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlugin() {
      try {
        // Register the remote dynamically
        __federation_method_setRemote(moduleName, {
            url: () => Promise.resolve(url),
            format: 'esm',
            from: 'vite'
        });

        // Fetch the remote module
        const module = await __federation_method_getRemote(moduleName, componentName);
        
        if (isMounted) {
          const Comp = module?.default || module;
          if (Comp) {
            setComponent(() => Comp);
          } else {
            setError(`Component not found in plugin.`);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to load federated plugin:", err);
          setError(err.message || 'Failed to load federated plugin');
        }
      }
    }

    loadPlugin();

    return () => {
      isMounted = false;
    };
  }, [url, moduleName, componentName]);

  if (error) {
    return <div style={{ color: '#ff6b6b', padding: '1rem', textAlign: 'center' }}>Error: {error}</div>;
  }

  if (!Component) {
    return <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Plugin...</div>;
  }

  return (
    <Suspense fallback={<div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
