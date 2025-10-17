import { create } from "zustand"

type State = {
    searchLoading: boolean
    searchError: string | null
    error: Error | null
}
type Actions = {
    setSearchLoading: (loading: boolean) => void
    setSearchError: (error: string | null) => void
    setError: (error: Error | null) => void
}
type AppStateStore = State & Actions

export const useAppStateStore = create<AppStateStore>((set) => ({
    searchLoading: false,
    searchError: null,
    error: null,
    setSearchLoading: (loading: boolean) => set({ searchLoading: loading }),
    setSearchError: (error: string | null) => set({ searchError: error }),
    setError: (error) => set({ error })
}))
