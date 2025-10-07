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

interface BasicWeatherData {
    meanTemp: TemperatureData,
    maxTemp: TemperatureData,
    minTemp: TemperatureData,
    rain: RainData
}

type TemperatureData = [number[]]

type RainData = {
    hours: [number[]]
    quantity: [number[]]
}
