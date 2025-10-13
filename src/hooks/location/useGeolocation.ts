import { getCurrentCoords } from "@/services/location/getCurrentCoords";
import { useQuery } from "@tanstack/react-query";

export const useGeolocation = () => {
    return useQuery({
        queryKey: ['geolocation'],
        queryFn: async () => getCurrentCoords(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
};