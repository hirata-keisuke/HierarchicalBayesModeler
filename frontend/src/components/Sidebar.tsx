import { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
} from '@mui/material'
import {
  Visibility,
  CloudUpload,
  Calculate,
  Functions,
  Delete,
} from '@mui/icons-material'
import { useModelStore, NodeType } from '../stores/modelStore'

const DRAWER_WIDTH = 280

const nodeTypeIcons = {
  observed: <Visibility />,
  latent: <CloudUpload />,
  hyperparameter: <Functions />,
  operation: <Calculate />,
}

const nodeTypeLabels = {
  observed: '観測変数',
  latent: '潜在変数',
  hyperparameter: 'ハイパーパラメータ',
  operation: '演算ノード',
}

const Sidebar = () => {
  const { addNode, clearModel, nodes } = useModelStore()
  const [nodeCounter, setNodeCounter] = useState(1)

  const handleAddNode = (nodeType: NodeType) => {
    const newNode = {
      id: `node-${nodeCounter}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        guiName: `${nodeTypeLabels[nodeType]}${nodeCounter}`,
        codeName: `var_${nodeCounter}`,
        nodeType,
        shape: nodeType === 'operation' ? undefined : '(n_observations,)',
        distribution: nodeType === 'operation' ? undefined : 'Normal',
        operation: nodeType === 'operation' ? 'add' : undefined,
        parameters: {},
      },
    }

    addNode(newNode as any)
    setNodeCounter(nodeCounter + 1)
  }

  const handleClearModel = () => {
    if (nodes.length > 0) {
      if (window.confirm('モデルをクリアしてもよろしいですか？')) {
        clearModel()
        setNodeCounter(1)
      }
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          階層ベイズモデルGUI
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ノードを追加してモデルを構築
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          ノードを追加
        </Typography>
        <List>
          {(Object.keys(nodeTypeLabels) as NodeType[]).map((nodeType) => (
            <ListItem key={nodeType} disablePadding>
              <ListItemButton onClick={() => handleAddNode(nodeType)}>
                <ListItemIcon>{nodeTypeIcons[nodeType]}</ListItemIcon>
                <ListItemText primary={nodeTypeLabels[nodeType]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          fullWidth
          onClick={handleClearModel}
          disabled={nodes.length === 0}
        >
          モデルをクリア
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          ノード数: {nodes.length}
        </Typography>
      </Box>
    </Drawer>
  )
}

export default Sidebar
