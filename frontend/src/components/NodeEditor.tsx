import React, { useState, useEffect } from 'react'
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
  Chip,
  Stack,
} from '@mui/material'
import { Close, Save, Delete } from '@mui/icons-material'
import { useModelStore } from '../stores/modelStore'
import { DistributionDefinition, OperationDefinition } from '../types'
import { useDefinitionsStore } from '../stores/definitionsStore'

const EDITOR_WIDTH = 400

const NodeEditor = () => {
  const { selectedNode, setSelectedNode, updateNode, deleteNode } = useModelStore()
  const { distributions, operations, fetchDefinitions } = useDefinitionsStore()

  const [guiName, setGuiName] = useState('')
  const [codeName, setCodeName] = useState('')
  const [shape, setShape] = useState('')
  const [distribution, setDistribution] = useState('')
  const [operation, setOperation] = useState('')
  const [constantValue, setConstantValue] = useState<string>('')
  const [parameters, setParameters] = useState<Record<string, any>>({})

  // 分布・演算定義を取得
  useEffect(() => {
    fetchDefinitions()
  }, [])

  useEffect(() => {
    if (selectedNode) {
      setGuiName(selectedNode.data.guiName)
      setCodeName(selectedNode.data.codeName)
      setShape(selectedNode.data.shape || '')
      setDistribution(selectedNode.data.distribution || '')
      setOperation(selectedNode.data.operation || '')
      setConstantValue(
        selectedNode.data.constantValue !== undefined
          ? String(selectedNode.data.constantValue)
          : ''
      )
      setParameters(selectedNode.data.parameters || {})
    }
  }, [selectedNode])

  const handleSave = () => {
    if (selectedNode) {
      const nodeType = selectedNode.data.nodeType
      const updates: any = {
        guiName,
        codeName,
      }

      if (nodeType === 'constant') {
        updates.constantValue = constantValue ? parseFloat(constantValue) : 0
      } else if (nodeType === 'operation') {
        updates.operation = operation
      } else if (nodeType !== 'data') {
        updates.shape = shape
        updates.distribution = distribution
        updates.parameters = parameters
      } else {
        updates.shape = shape
      }

      updateNode(selectedNode.id, updates)
      setSelectedNode(null)
    }
  }

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters((prev: Record<string, any>) => ({
      ...prev,
      [paramName]: value,
    }))
  }

  // 選択した分布の定義を取得
  const selectedDistributionDef = distributions.find((d: DistributionDefinition) => d.name === distribution)
  // 選択した演算の定義を取得
  const selectedOperationDef = operations.find((o: OperationDefinition) => o.name === operation)

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

  const nodeType = selectedNode.data.nodeType

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
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">ノード設定</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
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

          {/* 定数ノード用 */}
          {nodeType === 'constant' && (
            <TextField
              label="定数値"
              value={constantValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConstantValue(e.target.value)}
              fullWidth
              type="number"
              helperText="スカラー値を入力"
            />
          )}

          {/* データノード用 */}
          {nodeType === 'data' && (
            <TextField
              label="形状"
              value={shape}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShape(e.target.value)}
              fullWidth
              helperText="例: (n_observations,) or (n_observations, 3)"
            />
          )}

          {/* 演算ノード用 */}
          {nodeType === 'operation' && (
            <FormControl fullWidth>
              <InputLabel>演算</InputLabel>
              <Select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                label="演算"
              >
                {operations.map((op: OperationDefinition) => (
                  <MenuItem key={op.name} value={op.name}>
                    {op.display_name} ({op.notation})
                  </MenuItem>
                ))}
              </Select>
              {selectedOperationDef && (
                <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                  {selectedOperationDef.description}
                </Typography>
              )}
            </FormControl>
          )}

          {/* 分布を持つノード（観測変数、潜在変数、ハイパーパラメータ）用 */}
          {(nodeType === 'observed' || nodeType === 'latent' || nodeType === 'hyperparameter') && (
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
                  {distributions.map((dist: DistributionDefinition) => (
                    <MenuItem key={dist.name} value={dist.name}>
                      {dist.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 分布のパラメータ設定 */}
              {selectedDistributionDef && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    分布パラメータ
                  </Typography>
                  <Stack spacing={2}>
                    {selectedDistributionDef.parameters.map((param: any) => (
                      <Box key={param.name}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          {param.display_name}
                          {param.required && <Chip label="必須" size="small" sx={{ ml: 1, height: 16 }} />}
                        </Typography>
                        <TextField
                          label={`定数値 (handle: ${param.handle_id})`}
                          value={parameters[param.name] ?? param.default ?? ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleParameterChange(param.name, e.target.value)}
                          fullWidth
                          size="small"
                          type="number"
                          helperText={param.description}
                        />
                      </Box>
                    ))}
                  </Stack>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'info.main' }}>
                    ※ エッジで他のノードから接続することで、パラメータを動的に設定できます
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
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
    </Drawer>
  )
}

export default NodeEditor
