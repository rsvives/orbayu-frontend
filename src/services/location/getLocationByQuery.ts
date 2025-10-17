import axios, { AxiosError } from "axios";

export const getLocationBySearchQuery = async (query: string) => {

    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
                }
            })

        console.log({ response })

        if (response.data.length === 0) {
            throw new AxiosError("Location not found", '404')
        }

        if (response.status !== 200) {
            console.error({ response })
            throw new Error(response.data)
        }


        const [data] = await response.data;
        // console.log('function', { getlocationBySearch: data })
        return {
            name: data.display_name,
            coords: {
                lat: data.lat,
                lng: data.lon,
                accuracy: data.accuracy || null
            }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}