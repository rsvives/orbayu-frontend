import axios from "axios";

export const getLocationBySearchQuery = async (query: string) => {

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

    const [data] = await response.data;
    console.log('function', { getlocationBySearch: data })
    return data
}

export const getLocationByCoords = async ({ lat, lon }: { lat: number, lon: number }) => {

    const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=8&addressdetails=1`,
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            }
        }
    )
    const data = await response.data;
    console.log('function', { getLocationByCoords: data })
    return data
}

export const getCurrentLocation = async (): Promise<{ lat: number, lng: number, accuracy: number }> => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log({ position })
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                    })
                },
                (err) => {
                    console.error(err)
                    reject(new Error(err.message))
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            )
        } else {
            console.error('Geolocation not available')
            reject(new Error('Geolocation not available'))
        }
    })
}