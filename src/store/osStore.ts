import { create } from 'zustand';
import type { Layout } from 'react-grid-layout';
import { databases } from '../lib/appwrite';

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
  addWidget: (widget: Widget, layout: Layout) => void;
  removeWidget: (id: string) => void;
  updateLayouts: (newLayouts: { lg: Layout[] }) => void;
  isFreePlacement: boolean;
  togglePlacementMode: () => void;
  fetchPlugins: () => Promise<void>;
}

export const useOsStore = create<OsState>((set) => ({
  widgets: [
    { id: 'widget-1', title: 'Welcome Widget', componentName: 'Welcome' },
    { id: 'widget-2', title: 'Clock', componentName: 'Clock' }
  ],
  layouts: {
    lg: [
      { i: 'widget-1', x: 0, y: 0, w: 4, h: 4 },
      { i: 'widget-2', x: 4, y: 0, w: 2, h: 2 }
    ]
  },
  plugins: [],
  addWidget: (widget, layout) => set((state) => ({
    widgets: [...state.widgets, widget],
    layouts: {
      lg: [...state.layouts.lg, layout]
    }
  })),
  removeWidget: (id) => set((state) => ({
    widgets: state.widgets.filter((w) => w.id !== id),
    layouts: {
      lg: state.layouts.lg.filter((l) => l.i !== id)
    }
  })),
  updateLayouts: (newLayouts) => set({ layouts: newLayouts }),
  isFreePlacement: true,
  togglePlacementMode: () => set((state) => ({ isFreePlacement: !state.isFreePlacement })),
  fetchPlugins: async () => {
    try {
      const response = await databases.listDocuments('propojos_db', 'plugins');
      set({ plugins: response.documents as unknown as Plugin[] });
    } catch (e) {
      console.error('Failed to fetch plugins:', e);
    }
  }
}));
