import { getLocationBySearchQuery } from "@/services/location/getLocationByQuery";
import { useQuery } from "@tanstack/react-query";

export const useLocationBySearch = (searchTerm: string, shouldSearch: boolean) => {
    return useQuery({
        queryKey: ['location', 'search', searchTerm],
        queryFn: () => getLocationBySearchQuery(searchTerm),
        enabled: shouldSearch && searchTerm.length > 0,
        retry: 1,
    });
};