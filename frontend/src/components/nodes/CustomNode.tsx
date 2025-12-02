import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Box, Typography, Paper } from '@mui/material'
import { ModelNode } from '../../stores/modelStore'
import { NodeType } from '../../types'

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

  // ノードタイプに応じて入力ハンドルを生成
  const hasInputHandles = nodeType === 'observed' || nodeType === 'latent' || nodeType === 'hyperparameter' || nodeType === 'operation'

  // ノードタイプに応じて出力ハンドルを生成
  const hasOutputHandle = nodeType !== 'observed'

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
      {/* 入力ハンドル（左側） */}
      {hasInputHandles && (
        <Handle
          type="target"
          position={Position.Left}
          id="default"
          style={{
            background: color,
            width: 12,
            height: 12,
            left: -6,
          }}
        />
      )}

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
