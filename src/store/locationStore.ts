import { create } from 'zustand'

type State = {
    location: Coordinates
    radius: number
}
type Actions = {
    setLocation: (location: Coordinates) => void
    setRadius: (radius: number) => void
}

type LocationStore = State & Actions

const locationStore = create<LocationStore>((set) => ({
    location: { lat: null, lng: null, accuracy: null },
    radius: 30,
    setLocation: (location: Coordinates) => set({ location }),
    setRadius: (radius: number) => set({ radius })
}))

export default locationStore