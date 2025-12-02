import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  Connection,
  addEdge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Box } from '@mui/material'
import { useModelStore } from '../stores/modelStore'
import CustomNode from './nodes/CustomNode'

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
      setEdges(addEdge(params, edges))
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
        fitView
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const colors = {
              observed: '#4CAF50',
              latent: '#2196F3',
              hyperparameter: '#FF9800',
              operation: '#9C27B0',
            }
            return colors[node.data.nodeType as keyof typeof colors] || '#999'
          }}
        />
      </ReactFlow>
    </Box>
  )
}

export default ModelCanvas
