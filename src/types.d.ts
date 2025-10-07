type Coordinates = {
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    // radius: number;  
}

type Location = {
    name: string;
    coordinates: Coordinates;
}
type WeatherType = "rain" | "temperature" | "snow" | "wind"

interface BasicWeatherData {
    temps: TemperatureData[],

    rain: RainData
}

type TemperatureData = {
    year: number
    min_temps: number[]
    max_temps: number[]
    mean_temps: number[]
}

type RainData = {
    hours: [number[]]
    quantity: [number[]]
}
