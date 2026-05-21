import { create } from 'zustand';
import type { Layout } from 'react-grid-layout';
import { databases, client, ID } from '../lib/appwrite';
import { Query } from 'appwrite';
import { useEventStore } from './eventStore';

export interface Widget {
  id: string;
  title: string;
  componentName: string;
  isRemote?: boolean;
  url?: string;
  moduleName?: string;
  remoteComponent?: string;
}

export interface Plugin {
  $id: string;
  name: string;
  url: string;
  module: string;
  componentName: string;
}

interface OsState {
  widgets: Widget[];
  layouts: { lg: Layout[] };
  plugins: Plugin[];
  configDocId: string | null;
  userId: string | null;
  addWidget: (widget: Widget, layout: Layout) => void;
  removeWidget: (id: string) => void;
  updateLayouts: (newLayouts: { lg: Layout[] }) => void;
  currentView: 'dashboard' | 'workflow';
  toggleView: () => void;
  fetchPlugins: () => Promise<void>;
  syncFromAppwrite: (userId: string) => Promise<void>;
  saveToAppwrite: () => Promise<void>;
}

export const useOsStore = create<OsState>((set, get) => ({
  widgets: [
    { id: 'widget-1', title: 'Data Sender', componentName: 'SenderWidget' },
    { id: 'widget-2', title: 'Data Receiver', componentName: 'ReceiverWidget' },
    { id: 'widget-3', title: 'Serverless Runner', componentName: 'ServerlessWidget' }
  ],
  layouts: {
    lg: [
      { i: 'widget-1', x: 0, y: 0, w: 4, h: 4 },
      { i: 'widget-2', x: 4, y: 0, w: 4, h: 4 },
      { i: 'widget-3', x: 8, y: 0, w: 4, h: 4 }
    ]
  },
  plugins: [],
  configDocId: null,
  userId: null,
  addWidget: (widget, layout) => {
    set((state) => ({
      widgets: [...state.widgets, widget],
      layouts: {
        lg: [...state.layouts.lg, layout]
      }
    }));
    get().saveToAppwrite();
  },
  removeWidget: (id) => {
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
      layouts: {
        lg: state.layouts.lg.filter((l) => l.i !== id)
      }
    }));
    get().saveToAppwrite();
  },
  updateLayouts: (newLayouts) => {
    set({ layouts: newLayouts });
    get().saveToAppwrite();
  },
  currentView: 'dashboard',
  toggleView: () => set((state) => ({ currentView: state.currentView === 'dashboard' ? 'workflow' : 'dashboard' })),
  fetchPlugins: async () => {
    try {
      const response = await databases.listDocuments('propojos_db', 'plugins');
      set({ plugins: response.documents as unknown as Plugin[] });
    } catch (e) {
      console.error('Failed to fetch plugins:', e);
    }
  },
  syncFromAppwrite: async (userId) => {
    try {
      const response = await databases.listDocuments('propojos_db', 'os_configs', [
        Query.equal('userId', userId)
      ]);

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        set({
          configDocId: doc.$id,
          userId,
          widgets: JSON.parse(doc.widgets),
          layouts: JSON.parse(doc.layouts)
        });

        useEventStore.getState().setConnections(JSON.parse(doc.connections), false);
      } else {
        const defaultWidgets = [
          { id: 'widget-1', title: 'Data Sender', componentName: 'SenderWidget' },
          { id: 'widget-2', title: 'Data Receiver', componentName: 'ReceiverWidget' },
          { id: 'widget-3', title: 'Serverless Runner', componentName: 'ServerlessWidget' }
        ];
        const defaultLayouts = {
          lg: [
            { i: 'widget-1', x: 0, y: 0, w: 4, h: 4 },
            { i: 'widget-2', x: 4, y: 0, w: 4, h: 4 },
            { i: 'widget-3', x: 8, y: 0, w: 4, h: 4 }
          ]
        };
        const defaultConnections: any[] = [];

        const doc = await databases.createDocument('propojos_db', 'os_configs', ID.unique(), {
          userId,
          widgets: JSON.stringify(defaultWidgets),
          layouts: JSON.stringify(defaultLayouts),
          connections: JSON.stringify(defaultConnections)
        });

        set({
          configDocId: doc.$id,
          userId,
          widgets: defaultWidgets,
          layouts: defaultLayouts
        });

        useEventStore.getState().setConnections(defaultConnections, false);
      }

      // Initialize Appwrite Realtime listener for visual program changes
      client.subscribe(
        `databases.propojos_db.collections.os_configs.documents`,
        (response) => {
          const updatedDoc = response.payload as any;
          if (updatedDoc.userId !== userId) return; // verify matching user

          const currentWidgets = JSON.stringify(get().widgets);
          const currentLayouts = JSON.stringify(get().layouts);

          if (updatedDoc.widgets !== currentWidgets || updatedDoc.layouts !== currentLayouts) {
            set({
              widgets: JSON.parse(updatedDoc.widgets),
              layouts: JSON.parse(updatedDoc.layouts)
            });
          }

          const currentConnections = JSON.stringify(useEventStore.getState().connections);
          if (updatedDoc.connections !== currentConnections) {
            useEventStore.getState().setConnections(JSON.parse(updatedDoc.connections), false);
          }
        }
      );
    } catch (e) {
      console.error('Failed to sync from Appwrite:', e);
    }
  },
  saveToAppwrite: async () => {
    const { configDocId, widgets, layouts } = get();
    if (!configDocId) return;
    try {
      await databases.updateDocument('propojos_db', 'os_configs', configDocId, {
        widgets: JSON.stringify(widgets),
        layouts: JSON.stringify(layouts)
      });
    } catch (e) {
      console.error('Failed to save to Appwrite:', e);
    }
  }
}));
