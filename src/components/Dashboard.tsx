import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import type { Layouts } from 'react-grid-layout';
import { useOsStore } from '../store/osStore';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Dashboard() {
  const { widgets, layouts, updateLayouts, isFreePlacement } = useOsStore();

  const handleLayoutChange = (layout: any, allLayouts: Layouts) => {
    updateLayouts(allLayouts as { lg: any[] });
  };

  return (
    <div className="dashboard-container">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".widget-header"
        compactType={isFreePlacement ? null : 'vertical'}
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <div className="widget-card">
              <div className="widget-header">{widget.title}</div>
              <div className="widget-content">
                {widget.componentName} Widget Loading...
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
