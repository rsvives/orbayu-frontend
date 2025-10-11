import { create } from 'zustand'

type State = {
    searchQuery: string
    location: Coordinates
    radius: number
}
type Actions = {
    setSearchQuery: (search: string) => void
    setLocation: (location: Coordinates) => void
    setRadius: (radius: number) => void
}

type LocationStore = State & Actions

export const useLocationStore = create<LocationStore>((set) => ({
    searchQuery: '',
    location: { lat: null, lng: null, accuracy: null },
    radius: 30,
    setSearchQuery: (search) => set({ searchQuery: search }),
    setLocation: (location: Coordinates) => set({ location }),
    setRadius: (radius: number) => set({ radius })
}))
