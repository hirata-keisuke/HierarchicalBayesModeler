import { Box } from '@mui/material'
import { ReactFlowProvider } from 'reactflow'
import Sidebar from './Sidebar'
import ModelCanvas from './ModelCanvas'
import NodeEditor from './NodeEditor'

const ModelBuilder = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <ReactFlowProvider>
          <ModelCanvas />
          <NodeEditor />
        </ReactFlowProvider>
      </Box>
    </Box>
  )
}

export default ModelBuilder
