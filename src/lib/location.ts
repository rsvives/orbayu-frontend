export const checkLatitude = (lat: number) => {
    if (lat < -90 || lat > 90) {
        throw new Error("Latitude must be between -90 and 90")
    }
}
