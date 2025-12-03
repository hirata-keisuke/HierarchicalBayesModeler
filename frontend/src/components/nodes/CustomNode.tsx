import { memo, useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Box, Typography, Paper } from '@mui/material'
import { ModelNode } from '../../stores/modelStore'
import { NodeType, DistributionDefinition, OperationDefinition } from '../../types'
import { useDefinitionsStore } from '../../stores/definitionsStore'

const nodeColors: Record<NodeType, string> = {
  data: '#00BCD4',
  observed: '#4CAF50',
  latent: '#2196F3',
  hyperparameter: '#FF9800',
  operation: '#9C27B0',
  constant: '#9E9E9E',
}

const nodeLabels: Record<NodeType, string> = {
  data: 'データ',
  observed: '観測変数',
  latent: '潜在変数',
  hyperparameter: 'ハイパーパラメータ',
  operation: '演算ノード',
  constant: '定数',
}

const CustomNode = ({ data, selected }: NodeProps<ModelNode['data']>) => {
  const nodeType = data.nodeType
  const color = nodeColors[nodeType]
  const label = nodeLabels[nodeType]

  const { distributions, operations, fetchDefinitions } = useDefinitionsStore()

  // 分布・演算定義を取得
  useEffect(() => {
    fetchDefinitions()
  }, [])

  // ノードタイプに応じて出力ハンドルを生成
  const hasOutputHandle = nodeType !== 'observed'

  // 動的入力ハンドルの生成
  let inputHandles: Array<{ id: string; label: string }> = []

  if (nodeType === 'observed' || nodeType === 'latent' || nodeType === 'hyperparameter') {
    // 分布のパラメータに基づくハンドル
    const distDef = distributions.find((d: DistributionDefinition) => d.name === data.distribution)
    if (distDef) {
      inputHandles = distDef.parameters.map((param: any) => ({
        id: param.handle_id,
        label: param.display_name,
      }))
      console.log(`[${data.guiName}] Distribution: ${data.distribution}, Handles:`, inputHandles)
    } else {
      console.log(`[${data.guiName}] Distribution definition not found for: ${data.distribution}`)
    }
  } else if (nodeType === 'operation') {
    // 演算のオペランドに基づくハンドル
    const opDef = operations.find((o: OperationDefinition) => o.name === data.operation)
    if (opDef && opDef.handles) {
      inputHandles = opDef.handles
        .filter((h: any) => h.type === 'target')
        .map((h: any) => ({ id: h.id, label: h.label }))
      console.log(`[${data.guiName}] Operation: ${data.operation}, Handles:`, inputHandles)
    } else {
      console.log(`[${data.guiName}] Operation definition not found for: ${data.operation}`)
    }
  }

  return (
    <Paper
      elevation={selected ? 8 : 2}
      sx={{
        padding: 2,
        minWidth: 180,
        border: `2px solid ${color}`,
        borderRadius: 2,
        backgroundColor: 'white',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      {/* 入力ハンドル（左側）- 動的生成 */}
      {inputHandles.map((handle, index) => {
        const totalHandles = inputHandles.length
        const spacing = 100 / (totalHandles + 1)
        const topPosition = spacing * (index + 1)

        return (
          <Handle
            key={handle.id}
            type="target"
            position={Position.Left}
            id={handle.id}
            style={{
              background: color,
              width: 12,
              height: 12,
              left: -6,
              top: `${topPosition}%`,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: -8,
                top: '50%',
                transform: 'translateY(-50%) translateX(-100%)',
                fontSize: '0.65rem',
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '2px 4px',
                borderRadius: '4px',
                pointerEvents: 'none',
              }}
            >
              {handle.label}
            </Box>
          </Handle>
        )
      })}

      <Box>
        <Typography
          variant="caption"
          sx={{
            color: color,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
          }}
        >
          {label}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {data.guiName}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
        >
          {data.codeName}
        </Typography>

        {data.shape && (
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            形状: {data.shape}
          </Typography>
        )}

        {data.distribution && (
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'primary.main' }}>
            分布: {data.distribution}
          </Typography>
        )}

        {data.operation && (
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'secondary.main' }}>
            演算: {data.operation}
          </Typography>
        )}

        {data.constantValue !== undefined && (
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            値: {Array.isArray(data.constantValue) ? `[${data.constantValue.join(', ')}]` : data.constantValue}
          </Typography>
        )}
      </Box>

      {/* 出力ハンドル（右側） */}
      {hasOutputHandle && (
        <Handle
          type="source"
          position={Position.Right}
          id="output"
          style={{
            background: color,
            width: 12,
            height: 12,
            right: -6,
          }}
        />
      )}
    </Paper>
  )
}

export default memo(CustomNode)
