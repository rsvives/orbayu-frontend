import { AxiosError } from "axios"

export const errorHandler = (error: Error | AxiosError | GeolocationPositionError): { message: string, description: string } => {

    let message = ""
    let description = ""

    if (error instanceof AxiosError) {
        message = error.response?.data.detail || error.message
        description = "There was an error while fetching the location"
    } else if (error instanceof Error) {
        message = "There was an error"
        description = error.message
    } else if (error instanceof GeolocationPositionError) {
        message = error.message
        description = "Please check your device location settings and try again."
    }

    return { message, description }
}
