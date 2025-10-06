import axios from "axios"

export const weatherService = {
    getWeather: async ({ lat, lon, radius = 30000, start_date, end_date }: { lat: number | undefined | null, lon: number | undefined | null, radius: number, start_date: string, end_date: string }) => {
        console.log('getting weather data')
        console.log(new Date(start_date).toLocaleString('default'))
        const response = await axios.post('http://localhost:8000/weather_check',
            {
                lat,
                lon,
                radius,
                start_date: new Date(start_date).toLocaleString('default'),
                end_date: new Date(end_date).toLocaleString('default')
            }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + import.meta.env.VITE_ENV_JWT_TOKEN,
            }
        }
        )
        console.log(response)
        return response
    }
}