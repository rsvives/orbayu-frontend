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