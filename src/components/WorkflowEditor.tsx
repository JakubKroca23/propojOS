import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useOsStore } from '../store/osStore';
import { useEventStore } from '../store/eventStore';

export function WorkflowEditor() {
  const { widgets } = useOsStore();
  const { setConnections } = useEventStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync widgets to nodes
  useEffect(() => {
    // We only update if length changes to preserve positions, 
    // or we could use a more robust sync.
    setNodes((nds) => {
      const currentIds = new Set(nds.map(n => n.id));
      const newNodes = widgets.filter(w => !currentIds.has(w.id)).map((w, index) => ({
        id: w.id,
        position: { x: 250 * index + 100, y: 100 },
        data: { label: w.title || w.componentName }
      }));
      const keptNodes = nds.filter(n => widgets.some(w => w.id === n.id));
      return [...keptNodes, ...newNodes];
    });
  }, [widgets, setNodes]);

  // Sync edges to eventStore
  useEffect(() => {
    const appConns = edges.map((e) => ({
      id: e.id,
      sourceId: e.source,
      sourcePort: e.sourceHandle || 'out',
      targetId: e.target,
      targetPort: e.targetHandle || 'in'
    }));
    setConnections(appConns);
  }, [edges, setConnections]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
