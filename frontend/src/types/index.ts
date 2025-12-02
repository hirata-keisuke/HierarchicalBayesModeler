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

export interface DistributionDefinition {
  name: string
  display_name: string
  parameters: ParameterDefinition[]
  pymc_class: string
  support: string
  multivariate: boolean
  description?: string
}

export interface ParameterDefinition {
  name: string
  display_name: string
  type: string
  default?: any
  description?: string
  required: boolean
}

export interface OperationDefinition {
  name: string
  display_name: string
  notation: string
  pymc_function: string
  operands: number
  operand_names: string[]
  broadcasting: boolean
  description?: string
}
