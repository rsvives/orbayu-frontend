import { create } from 'zustand'

type State = {
    selectedWeather: Set<WeatherType>
    weatherData: BasicWeatherData | null
    temperature: {
        min: number | null,
        max: number | null,
        mean: number | null
    }
}
type Actions = {
    setWeatherData: (weatherData: BasicWeatherData) => void
    setTemperature: (temperature: { min: number | null, max: number | null, mean: number | null }) => void
}

type WeatherDataStore = State & Actions

export const useWeatherDataStore = create<WeatherDataStore>((set) => ({
    weatherData: null,
    selectedWeather: new Set<WeatherType>(['rain']),
    temperature: {
        min: null,
        max: null,
        mean: null
    },
    setTemperature: (temp) => set(({ temperature }) => ({ temperature: { ...temperature, ...temp } })),
    setWeatherData: (weatherData: BasicWeatherData) => set({ weatherData })
}))

// export default useWeatherDataStore