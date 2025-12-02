import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Box, Typography, Paper } from '@mui/material'
import { ModelNode } from '../../stores/modelStore'

const nodeColors = {
  observed: '#4CAF50',
  latent: '#2196F3',
  hyperparameter: '#FF9800',
  operation: '#9C27B0',
}

const nodeLabels = {
  observed: '観測変数',
  latent: '潜在変数',
  hyperparameter: 'ハイパーパラメータ',
  operation: '演算ノード',
}

const CustomNode = ({ data, selected }: NodeProps<ModelNode['data']>) => {
  const nodeType = data.nodeType
  const color = nodeColors[nodeType]
  const label = nodeLabels[nodeType]

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
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: color }}
      />

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
      </Box>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: color }}
      />
    </Paper>
  )
}

export default memo(CustomNode)
