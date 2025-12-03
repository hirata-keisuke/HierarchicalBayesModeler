import { create } from 'zustand'
import { DistributionDefinition, OperationDefinition } from '../types'
import api from '../services/api'

interface DefinitionsState {
  distributions: DistributionDefinition[]
  operations: OperationDefinition[]
  isLoading: boolean
  error: string | null
  fetchDefinitions: () => Promise<void>
}

export const useDefinitionsStore = create<DefinitionsState>((set, get) => ({
  distributions: [],
  operations: [],
  isLoading: false,
  error: null,

  fetchDefinitions: async () => {
    // 既にロード済みならスキップ
    if (get().distributions.length > 0 || get().isLoading) {
      return
    }

    set({ isLoading: true, error: null })

    try {
      const [distResp, opResp] = await Promise.all([
        api.get<DistributionDefinition[]>('/distributions'),
        api.get<OperationDefinition[]>('/operations'),
      ])
      set({
        distributions: distResp.data,
        operations: opResp.data,
        isLoading: false,
      })
      console.log('Definitions loaded:', {
        distributions: distResp.data.length,
        operations: opResp.data.length,
      })
    } catch (error) {
      console.error('Failed to fetch definitions:', error)
      set({ error: String(error), isLoading: false })
    }
  },
}))
