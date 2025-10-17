import axios from "axios"

const API_URL = import.meta.env.PROD ? import.meta.env.VITE_ENV_API_URL : "http://localhost:8000"

export const weatherService = {
    getWeather: async ({ lat, lon, radius = 30000, start_date, end_date }: { lat: number | undefined | null, lon: number | undefined | null, radius: number, start_date: string, end_date: string }) => {
        console.log('getting weather data')
        console.log(new Date(start_date).toLocaleString('default'))
        try {
            const response = await axios.post(API_URL + '/weather_check',
                {
                    lat,
                    lon,
                    radius: radius * 1000,
                    start_date: new Date(start_date).toLocaleString('default'),
                    end_date: new Date(end_date).toLocaleString('default')
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + import.meta.env.VITE_ENV_JWT_TOKEN,
                }
            })
            if (response.status !== 200) {
                console.error(response)
                throw new Error(response.data)
            }
            console.log({ weatherData: response.data })
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export const healthCheckService = {

    getHealthCheck: async () => {

        // if (import.meta.env.PROD) {
        console.log('getting health check data')
        try {
            const response = await axios.get(API_URL + '/health', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + import.meta.env.VITE_ENV_JWT_TOKEN,
                }
            })
            if (response.status !== 200) {
                console.error(response)
                throw new Error(response.data)
            }
            console.log({ healthCheck: response.data })
            return response.data
        } catch (error) {
            console.error(error)
            throw error
        }

        // }
    }
}