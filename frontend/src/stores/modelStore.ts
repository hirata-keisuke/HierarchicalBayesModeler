import { create } from 'zustand'
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow'
import { NodeType } from '../types'

export interface ModelNode extends Node {
  data: {
    guiName: string
    codeName: string
    nodeType: NodeType
    shape?: string
    distribution?: string
    parameters?: Record<string, any>
    operation?: string
    constantValue?: number | number[]
    csvMapping?: Record<string, string>
  }
}

interface ModelState {
  nodes: ModelNode[]
  edges: Edge[]
  selectedNode: ModelNode | null
  modelId: string | null

  // アクション
  setNodes: (nodes: ModelNode[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  addNode: (node: ModelNode) => void
  updateNode: (nodeId: string, data: Partial<ModelNode['data']>) => void
  deleteNode: (nodeId: string) => void
  setSelectedNode: (node: ModelNode | null) => void
  setModelId: (modelId: string) => void
  clearModel: () => void
}

export const useModelStore = create<ModelState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  modelId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as ModelNode[],
    })
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }))
  },

  updateNode: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    }))
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    }))
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  setModelId: (modelId) => set({ modelId }),

  clearModel: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      modelId: null,
    }),
}))
