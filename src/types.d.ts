type Coordinates = {
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    // radius: number;  
}

type LocationType = {
    name: string | null;
    coords: Coordinates;
}
type WeatherType = "rain" | "temperature" | "snow" | "wind"

interface BasicWeatherData {
    temps: TemperatureData[],
    rain: RainData[]
}

type TemperatureData = {
    year: number
    min_temps: number[]
    max_temps: number[]
    mean_temps: number[]
}

type RainData = {
    year: number
    hours: number[]
    quantity: number[]
}
