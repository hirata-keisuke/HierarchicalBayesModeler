import React, { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  Connection,
  addEdge,
  MarkerType,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Box } from '@mui/material'
import { useModelStore } from '../stores/modelStore'
import CustomNode from './nodes/CustomNode'
import { NodeType } from '../types'

const nodeColors: Record<NodeType, string> = {
  data: '#00BCD4',
  observed: '#4CAF50',
  latent: '#2196F3',
  hyperparameter: '#FF9800',
  operation: '#9C27B0',
  constant: '#9E9E9E',
}

const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  },
  style: {
    strokeWidth: 2,
  },
}

const ModelCanvas = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setEdges,
    setSelectedNode,
  } = useModelStore()

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), [])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        ...defaultEdgeOptions,
      }
      setEdges(addEdge(newEdge, edges))
    },
    [edges, setEdges]
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node)
    },
    [setSelectedNode]
  )

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            return nodeColors[node.data.nodeType as NodeType] || '#999'
          }}
        />
      </ReactFlow>
    </Box>
  )
}

export default ModelCanvas
