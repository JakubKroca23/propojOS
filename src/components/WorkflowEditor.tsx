import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position
} from '@xyflow/react';
import type { Connection, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useOsStore } from '../store/osStore';
import { useEventStore } from '../store/eventStore';

// Custom Glowing Glassmorphic Node Type
function WorkflowNode({ data }: { data: { label: string; componentName: string } }) {
  const { label, componentName } = data;
  const hasInput = componentName !== 'SenderWidget';
  const hasOutput = componentName !== 'ReceiverWidget' && componentName !== 'ServerlessWidget';

  // Dynamic visual indicators based on component identity
  let icon = '⚙️';
  let glowColor = 'rgba(129, 140, 248, 0.35)';
  let borderColor = 'rgba(129, 140, 248, 0.2)';
  
  if (componentName === 'SenderWidget') {
    icon = '📤';
    glowColor = 'rgba(52, 211, 153, 0.35)';
    borderColor = 'rgba(52, 211, 153, 0.2)';
  } else if (componentName === 'ReceiverWidget') {
    icon = '📥';
    glowColor = 'rgba(56, 189, 248, 0.35)';
    borderColor = 'rgba(56, 189, 248, 0.2)';
  } else if (componentName === 'ServerlessWidget') {
    icon = '⚡';
    glowColor = 'rgba(251, 191, 36, 0.35)';
    borderColor = 'rgba(251, 191, 36, 0.2)';
  }

  return (
    <div style={{
      padding: '0.75rem 1rem',
      borderRadius: '12px',
      background: 'rgba(10, 16, 36, 0.85)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${borderColor}`,
      boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 16px ${glowColor}`,
      color: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      minWidth: '180px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      position: 'relative'
    }}>
      {/* Target Port Handle */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          id="in"
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#38bdf8',
            border: '2px solid #050814',
            boxShadow: '0 0 8px #38bdf8',
            left: '-6px'
          }}
        />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '-0.015em' }}>{label}</span>
      </div>
      
      <div style={{ 
        fontSize: '0.7rem', 
        color: '#94a3b8', 
        fontFamily: "'JetBrains Mono', monospace",
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '2px 6px',
        borderRadius: '4px',
        alignSelf: 'flex-start'
      }}>
        {componentName}
      </div>

      {/* Source Port Handle */}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#818cf8',
            border: '2px solid #050814',
            boxShadow: '0 0 8px #818cf8',
            right: '-6px'
          }}
        />
      )}
    </div>
  );
}

// React Flow node type registry (outside the component for performance optimization)
const nodeTypes = {
  workflowNode: WorkflowNode,
};

export function WorkflowEditor() {
  const { widgets } = useOsStore();
  const { setConnections } = useEventStore();
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync active dashboard widgets to the node canvas dynamically
  useEffect(() => {
    setNodes((nds) => {
      const currentIds = new Set(nds.map(n => n.id));
      const newNodes = widgets.filter(w => !currentIds.has(w.id)).map((w, index) => ({
        id: w.id,
        type: 'workflowNode',
        position: { x: 250 * index + 100, y: 150 },
        data: { label: w.title || w.componentName, componentName: w.componentName }
      }));
      const keptNodes = nds.filter(n => widgets.some(w => w.id === n.id));
      return [...keptNodes, ...newNodes];
    });
  }, [widgets, setNodes]);

  // Sync canvas connections back to database config store
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
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={16} size={1.5} color="rgba(255, 255, 255, 0.05)" />
      </ReactFlow>
    </div>
  );
}
