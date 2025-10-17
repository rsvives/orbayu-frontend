export const getRainIntensity = (intensity: number) => {

    const rainIntensityIntervals = {
        none: 0,
        weak: 0.1,
        moderate: 2,
        strong: 15,
        veryStrong: 30,
        torrential: 60,
    }

    let interval = ""
    Object.entries(rainIntensityIntervals).forEach(([key, value]) => {
        if (intensity >= value) {
            interval = key
        }
    })
    return { interval, rainIntensityIntervals }

}