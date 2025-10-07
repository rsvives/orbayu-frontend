import { create } from 'zustand'

type State = {
    selectedWeather: Set<WeatherType>
    weatherData: BasicWeatherData | null
}
type Actions = {
    setWeatherData: (weatherData: BasicWeatherData) => void
}

type WeatherDataStore = State & Actions

export const useWeatherDataStore = create<WeatherDataStore>((set) => ({
    weatherData: null,
    selectedWeather: new Set<WeatherType>(['rain']),
    setWeatherData: (weatherData: BasicWeatherData) => set({ weatherData })
}))

// export default useWeatherDataStore