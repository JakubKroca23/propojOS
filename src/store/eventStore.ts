import { create } from 'zustand';
import { databases } from '../lib/appwrite';
import { useOsStore } from './osStore';

export interface AppConnection {
  id: string; // e.g. edge id from react flow
  sourceId: string;
  sourcePort: string;
  targetId: string;
  targetPort: string;
}

interface EventState {
  connections: AppConnection[];
  // inputs structure: { [targetId]: { [targetPort]: data } }
  inputs: Record<string, Record<string, any>>;
  
  setConnections: (connections: AppConnection[], saveToDb?: boolean) => void;
  emit: (sourceId: string, sourcePort: string, data: any) => void;
}

export const useEventStore = create<EventState>((set, get) => ({
  connections: [],
  inputs: {},
  setConnections: (connections, saveToDb = true) => {
    set({ connections });
    
    if (saveToDb) {
      const configDocId = useOsStore.getState().configDocId;
      if (configDocId) {
        databases.updateDocument('propojos_db', 'os_configs', configDocId, {
          connections: JSON.stringify(connections)
        }).catch((e) => console.error('Failed to save connections to Appwrite:', e));
      }
    }
  },
  emit: (sourceId, sourcePort, data) => {
    const { connections } = get();
    // Find all active connections coming from this source port
    const activeConnections = connections.filter(
      (c) => c.sourceId === sourceId && c.sourcePort === sourcePort
    );

    if (activeConnections.length === 0) return;

    set((state) => {
      const newInputs = { ...state.inputs };
      
      activeConnections.forEach((conn) => {
        if (!newInputs[conn.targetId]) {
          newInputs[conn.targetId] = {};
        }
        // Immutable update of the target port data
        newInputs[conn.targetId] = {
          ...newInputs[conn.targetId],
          [conn.targetPort]: data
        };
      });

      return { inputs: newInputs };
    });
  }
}));
