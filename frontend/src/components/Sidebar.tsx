import React, { useState } from 'react'
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
  DataObject,
  Tag,
} from '@mui/icons-material'
import { useModelStore } from '../stores/modelStore'
import { NodeType } from '../types'

const DRAWER_WIDTH = 280

const nodeTypeIcons = {
  data: <DataObject />,
  observed: <Visibility />,
  latent: <CloudUpload />,
  hyperparameter: <Functions />,
  operation: <Calculate />,
  constant: <Tag />,
}

const nodeTypeLabels: Record<NodeType, string> = {
  data: 'データ（説明変数）',
  observed: '観測変数',
  latent: '潜在変数',
  hyperparameter: 'ハイパーパラメータ',
  operation: '演算ノード',
  constant: '定数',
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
        shape: nodeType === 'operation' || nodeType === 'constant' ? undefined : '(n_observations,)',
        distribution: nodeType === 'observed' || nodeType === 'latent' || nodeType === 'hyperparameter' ? 'Normal' : undefined,
        operation: nodeType === 'operation' ? 'add' : undefined,
        parameters: {},
        constantValue: nodeType === 'constant' ? 0 : undefined,
        csvMapping: nodeType === 'data' || nodeType === 'observed' ? {} : undefined,
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
