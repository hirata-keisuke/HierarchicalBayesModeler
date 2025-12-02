export type NodeType = 'data' | 'observed' | 'latent' | 'hyperparameter' | 'operation' | 'constant'

export interface ModelCreate {
  name: string
  description?: string
}

export interface ModelResponse {
  model_id: string
  name: string
  description?: string
  created_at: string
  session_id: string
}

export interface HandleDefinition {
  id: string
  label: string
  type: 'source' | 'target'
}

export interface ParameterDefinition {
  name: string
  display_name: string
  type: string
  handle_id: string
  default?: any
  description?: string
  required: boolean
}

export interface DistributionDefinition {
  name: string
  display_name: string
  parameters: ParameterDefinition[]
  pymc_class: string
  support: string
  multivariate: boolean
  description?: string
}

export interface OperationDefinition {
  name: string
  display_name: string
  notation: string
  pymc_function: string
  operands: number
  operand_names: string[]
  handles: HandleDefinition[]
  broadcasting: boolean
  description?: string
}

export interface NodeCreate {
  node_type: NodeType
  gui_name: string
  code_name: string
  shape?: string
  distribution?: string
  parameters?: Record<string, any>
  operation?: string
  position: { x: number; y: number }
  constant_value?: number | number[]
  csv_mapping?: Record<string, string>
}

export interface NodeUpdate {
  gui_name?: string
  code_name?: string
  shape?: string
  distribution?: string
  parameters?: Record<string, any>
  operation?: string
  position?: { x: number; y: number }
  constant_value?: number | number[]
  csv_mapping?: Record<string, string>
}

export interface NodeResponse {
  node_id: string
  node_type: NodeType
  gui_name: string
  code_name: string
  shape?: string
  distribution?: string
  parameters?: Record<string, any>
  operation?: string
  position: { x: number; y: number }
  constant_value?: number | number[]
  csv_mapping?: Record<string, string>
}

export interface EdgeCreate {
  source: string
  target: string
  source_handle?: string
  target_handle?: string
}

export interface EdgeResponse {
  edge_id: string
  source: string
  target: string
  source_handle?: string
  target_handle?: string
}
