import { useState, useEffect } from 'react'
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material'
import { Close, Save, Delete } from '@mui/icons-material'
import { useModelStore } from '../stores/modelStore'

const EDITOR_WIDTH = 360

const NodeEditor = () => {
  const { selectedNode, setSelectedNode, updateNode, deleteNode } = useModelStore()
  const [guiName, setGuiName] = useState('')
  const [codeName, setCodeName] = useState('')
  const [shape, setShape] = useState('')
  const [distribution, setDistribution] = useState('')
  const [operation, setOperation] = useState('')

  useEffect(() => {
    if (selectedNode) {
      setGuiName(selectedNode.data.guiName)
      setCodeName(selectedNode.data.codeName)
      setShape(selectedNode.data.shape || '')
      setDistribution(selectedNode.data.distribution || '')
      setOperation(selectedNode.data.operation || '')
    }
  }, [selectedNode])

  const handleSave = () => {
    if (selectedNode) {
      updateNode(selectedNode.id, {
        guiName,
        codeName,
        shape: selectedNode.data.nodeType !== 'operation' ? shape : undefined,
        distribution: selectedNode.data.nodeType !== 'operation' ? distribution : undefined,
        operation: selectedNode.data.nodeType === 'operation' ? operation : undefined,
      })
      setSelectedNode(null)
    }
  }

  const handleDelete = () => {
    if (selectedNode) {
      if (window.confirm('このノードを削除してもよろしいですか？')) {
        deleteNode(selectedNode.id)
        setSelectedNode(null)
      }
    }
  }

  const handleClose = () => {
    setSelectedNode(null)
  }

  if (!selectedNode) return null

  const isOperation = selectedNode.data.nodeType === 'operation'

  return (
    <Drawer
      anchor="right"
      open={!!selectedNode}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: EDITOR_WIDTH,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">ノード設定</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="表示名（日本語可）"
            value={guiName}
            onChange={(e) => setGuiName(e.target.value)}
            fullWidth
          />

          <TextField
            label="コード変数名"
            value={codeName}
            onChange={(e) => setCodeName(e.target.value)}
            fullWidth
            helperText="英数字とアンダースコア"
          />

          {!isOperation && (
            <>
              <TextField
                label="形状"
                value={shape}
                onChange={(e) => setShape(e.target.value)}
                fullWidth
                helperText="例: (n_observations,) or (n_observations, 3)"
              />

              <FormControl fullWidth>
                <InputLabel>分布</InputLabel>
                <Select
                  value={distribution}
                  onChange={(e) => setDistribution(e.target.value)}
                  label="分布"
                >
                  <MenuItem value="Normal">正規分布</MenuItem>
                  <MenuItem value="Gamma">ガンマ分布</MenuItem>
                  <MenuItem value="Beta">ベータ分布</MenuItem>
                  <MenuItem value="Bernoulli">ベルヌーイ分布</MenuItem>
                  <MenuItem value="Poisson">ポアソン分布</MenuItem>
                  <MenuItem value="Uniform">一様分布</MenuItem>
                  <MenuItem value="Exponential">指数分布</MenuItem>
                  <MenuItem value="HalfNormal">半正規分布</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          {isOperation && (
            <FormControl fullWidth>
              <InputLabel>演算</InputLabel>
              <Select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                label="演算"
              >
                <MenuItem value="add">和 (A + B)</MenuItem>
                <MenuItem value="subtract">差 (A - B)</MenuItem>
                <MenuItem value="multiply">積 (A * B)</MenuItem>
                <MenuItem value="matmul">行列積 (A @ B)</MenuItem>
                <MenuItem value="exp">指数 (exp(A))</MenuItem>
                <MenuItem value="log">対数 (log(A))</MenuItem>
                <MenuItem value="sqrt">平方根 (sqrt(A))</MenuItem>
                <MenuItem value="abs">絶対値 (abs(A))</MenuItem>
                <MenuItem value="sigmoid">シグモイド (sigmoid(A))</MenuItem>
                <MenuItem value="softmax">ソフトマックス (softmax(A))</MenuItem>
              </Select>
            </FormControl>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              fullWidth
            >
              保存
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
            >
              削除
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

export default NodeEditor
