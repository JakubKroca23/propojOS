import { create } from 'zustand';
import { Layout } from 'react-grid-layout';

export interface Widget {
  id: string;
  title: string;
  componentName: string; // Used to lazily load or select the right component
}

interface OsState {
  widgets: Widget[];
  layouts: { lg: Layout[] };
  addWidget: (widget: Widget, layout: Layout) => void;
  removeWidget: (id: string) => void;
  updateLayouts: (newLayouts: { lg: Layout[] }) => void;
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
  updateLayouts: (newLayouts) => set({ layouts: newLayouts })
}));
