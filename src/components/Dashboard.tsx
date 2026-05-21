import { useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import type { Layout, ResponsiveLayouts } from 'react-grid-layout';
import { useOsStore } from '../store/osStore';
import { PluginLoader } from './PluginLoader';
import { SenderWidget } from './widgets/SenderWidget';
import { ReceiverWidget } from './widgets/ReceiverWidget';
import { ServerlessWidget } from './widgets/ServerlessWidget';
import './Dashboard.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Dashboard() {
  const { widgets, layouts, updateLayouts, fetchPlugins } = useOsStore();

  useEffect(() => {
    fetchPlugins();
  }, [fetchPlugins]);

  const handleLayoutChange = (_layout: Layout, allLayouts: ResponsiveLayouts<string>) => {
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
        compactType="vertical"
      >
        {widgets.map((widget) => (
          <div key={widget.id}>
            <div className="widget-card">
              <div className="widget-header">{widget.title}</div>
              <div className="widget-content">
                {widget.isRemote && widget.url && widget.moduleName && widget.remoteComponent ? (
                  <PluginLoader 
                    url={widget.url} 
                    moduleName={widget.moduleName} 
                    componentName={widget.remoteComponent} 
                  />
                ) : widget.componentName === 'SenderWidget' ? (
                  <SenderWidget id={widget.id} />
                ) : widget.componentName === 'ReceiverWidget' ? (
                  <ReceiverWidget id={widget.id} />
                ) : widget.componentName === 'ServerlessWidget' ? (
                  <ServerlessWidget id={widget.id} />
                ) : (
                  <div>{widget.componentName} Widget Loading...</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
