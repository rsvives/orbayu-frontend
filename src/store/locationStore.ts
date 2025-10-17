import { create } from 'zustand'

type State = {
    searchQuery: string
    location: LocationType | undefined | null
    radius: number
    shouldSearch: boolean
}
type Actions = {
    setSearchQuery: (search: string) => void
    setLocation: (location: LocationType | null | undefined) => void
    setRadius: (radius: number) => void
    setShouldSearch: (shouldSearch: boolean) => void
}

type LocationStore = State & Actions

export const useLocationStore = create<LocationStore>((set) => ({
    searchQuery: '',
    location: { name: null, coords: { lat: null, lng: null, accuracy: null, } },
    radius: 30,
    shouldSearch: false,
    setSearchQuery: (search) => set({ searchQuery: search }),
    setLocation: (location) => set({ location }),
    setRadius: (radius) => set({ radius }),
    setShouldSearch: (shouldSearch) => set({ shouldSearch })
}))
