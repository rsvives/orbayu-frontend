import { useQuery } from "@tanstack/react-query";

export const useGeolocation = () => {
    return useQuery({
        queryKey: ['geolocation'],
        queryFn: async () => {
            return new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('Geolocalización no disponible'));
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }),
                    (error) => reject(error)
                );
            });
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
};