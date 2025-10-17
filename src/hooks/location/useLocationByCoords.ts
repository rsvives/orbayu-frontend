import { getLocationByCoords } from "@/services/location/getLocationByCoords";
import { useQuery } from "@tanstack/react-query";

export const useLocationByCoords = (lat?: number, lng?: number) => {
    return useQuery({
        queryKey: ['location', 'coords', lat, lng],
        queryFn: () => getLocationByCoords({ lat: lat!, lon: lng! }),
        enabled: !!lat && !!lng, // Only executes if there are coordinates
        retry: 1,
    });
};