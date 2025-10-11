import { useState, useEffect, useRef, type FormEvent } from 'react';
import { MapPin, Loader2, Search, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { InputGroup, InputGroupInput } from './ui/input-group';
import { DatesSection } from './DatesSection';
import { getCurrentLocation, getLocationByCoords, getLocationBySearchQuery } from '@/lib/location';
import { Map } from './Map';
import { DrawerDialog } from './DrawerDialog';
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weatherService';
import { formatDate } from '@/lib/dates';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Label } from './ui/label';
import { useDatesStore } from '@/store/datesStore';
import { useWeatherDataStore } from '@/store/weatherDataStore';
import { useLocationStore } from '@/store/locationStore';
import { useAppStateStore } from '@/store/appStateStore';

export default function LocationMap() {

    const initialLocation = useRef<{ lat: number | null, lng: number | null, accuracy: number | null } | null>(null);
    const [drawerDialogOpen, setDrawerDialogOpen] = useState(false);


    const { setSearchQuery, location, radius, setLocation } = useLocationStore()
    const { error, setError, setSearchError } = useAppStateStore()
    const { weatherData, setWeatherData } = useWeatherDataStore()
    const { startDate, endDate } = useDatesStore()

    useEffect(() => {
        handleRefresh()
    }, []);

    const weatherCheckData = useQuery({
        queryKey: ['weather', location.lat, location.lng, radius, startDate, endDate],
        queryFn: async () => await weatherService.getWeather({
            lat: location.lat,
            lon: location.lng, radius,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate)
        }),
        enabled: false,
    })

    // Handle success logic when query data changes
    useEffect(() => {
        if (weatherCheckData.isFetching) {
            setDrawerDialogOpen(true)
        }
        if (weatherCheckData.data && !weatherCheckData.isFetching && !weatherCheckData.error) {
            console.log("Weather data loaded successfully!", weatherCheckData.data)
            setDrawerDialogOpen(true)
            setWeatherData(weatherCheckData.data)
        }
    }, [weatherCheckData.data, weatherCheckData.isFetching, weatherCheckData.error, setWeatherData])

    useEffect(() => {
        if (error) {
            toast.error("Geolocation unavailable", {
                description: "Please check your device location settings and try again.",
                classNames: { error: 'bg-red-500 text-white' },
                duration: 10000,
                dismissible: true,
                cancel: <Button variant="outline" onClick={() => toast.dismiss()}>Close</Button>,
                action: <Button onClick={handleRefresh}>Retry</Button>
            })
        }
    }, [error])


    const handleRefresh = async () => {
        console.log('refresh')
        if (initialLocation.current?.lat && initialLocation.current?.lng) {
            setLocation(initialLocation.current);
            const locationName = await getLocationByCoords({ lat: initialLocation.current.lat, lon: initialLocation.current.lng })
            console.log(initialLocation.current, locationName)
            setSearchQuery('');
            setError(null);
            setSearchError(null);
        } else {
            setError(null);
            setSearchQuery('');
            try {
                const currentLocation = await getCurrentLocation()
                if (currentLocation) {
                    console.log('current')
                    initialLocation.current = currentLocation;
                    setLocation(currentLocation);
                    console.log(currentLocation)
                    const locationName = await getLocationByCoords({ lat: currentLocation.lat, lon: currentLocation.lng })
                    console.log(initialLocation.current, { locationName })

                    setSearchQuery(locationName.display_name);
                    // setLoading(false);
                }
            }
            catch (err) {
                console.error({ err })
                if (err instanceof Error) {
                    setError(err.message);

                }
                // setLoading(false);
            }

        }
    };

    const handleDrawArea = () => {
        toast('Feature not available yet', {
            duration: 5000,
            dismissible: true,
            action: { label: 'Close', onClick: () => toast.dismiss() }
        })
    }


    return (
        < div className="max-w-4xl mx-auto" >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Content */}
                <div className="p-4 pt-2 sm:p-6 flex flex-col gap-4">
                    <div className='flex gap-4 flex-wrap sm:flex-nowrap'>
                        <LocationCard handleDrawArea={handleDrawArea} />
                    </div>
                    <div className="space-y-6">
                        <DatesSection handleCheckWeatherQuery={() => weatherCheckData.refetch()} dataPending={weatherCheckData.isFetching} />
                        <DrawerDialog data={weatherData} open={drawerDialogOpen} setOpen={setDrawerDialogOpen} />
                    </div>

                </div>
            </div>


        </div >
    );
}

const LocationCard = ({ handleDrawArea }: { handleDrawArea: () => void }) => {

    const { location, radius, setRadius } = useLocationStore()
    const { searchError } = useAppStateStore()
    const isMobile = useMediaQuery('(max-width: 768px)')


    const handleRadiusChange = (value: number[]) => {
        setRadius(value[0]);
    }

    if (isMobile) {
        return (
            <Card className='w-full md:w-1/2 gap-2  shadow-none'>
                <CardHeader className=''>
                    <CardTitle className='flex items-center gap-2 text-sm'>
                        <MapPin className="h-3 w-3" />
                        <h3>Location</h3>
                    </CardTitle>
                </CardHeader>
                <CardContent className=' flex flex-col gap-4' >
                    <SearchBar />
                    <div className='flex items-center gap-2 justify-between'>
                        <Label>Radius</Label>
                        <h3 className='text-md font-medium text-sm'>{radius} km</h3>
                    </div>
                    <div className='w-full h-4 '>
                        <Slider defaultValue={[radius]} max={100} min={1} step={5} onValueChange={handleRadiusChange} />
                    </div>
                </CardContent>

                <CardFooter>
                    <div className="overflow-hidden rounded-xl w-full">
                        <Map lat={location.lat} lng={location.lng} radius={radius} />
                    </div>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex gap-4">
                <Card className='w-full md:w-1/2 gap-2 p-2 shadow-none'>
                    <CardHeader className='px-2'>
                        <CardTitle className='flex items-center gap-2 text-sm'>
                            <MapPin className="h-3 w-3" />
                            <h3>Location</h3>
                        </CardTitle>

                    </CardHeader>
                    <CardContent className='px-2' >
                        <SearchBar />
                    </CardContent>
                    <CardFooter>
                        {searchError && <p className="text-sm text-red-600 text-center">{searchError}</p>}
                    </CardFooter>
                </Card>
                <div className='w-full sm:w-1/3 md:w-1/2 flex gap-4 '>
                    <Card className='w-full  md:w-1/2 gap-2 p-2 shadow-none'>
                        <CardHeader className='px-2'>
                            <CardTitle className='flex items-center justify-between gap-2 text-sm'>
                                <Label>Radius</Label>
                                <h3 className='text-md font-medium flex-1 text-center'>{radius} km</h3>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='flex items-center gap-2 text-sm justify-center flex-1 px-2'>
                            <div className='w-full h-4 '>
                                <Slider defaultValue={[radius]} max={100} min={1} step={5} onValueChange={handleRadiusChange} />
                            </div>
                        </CardContent>

                    </Card>
                    <Card className='hidden md:flex sm:w-1/2 gap-2 p-2 shadow-none'>
                        <CardHeader className='px-2'>
                            <CardTitle className='flex items-center justify-between gap-2 text-sm'>Draw your own area</CardTitle>
                        </CardHeader>
                        <CardContent className='flex items-center text-sm px-2'>
                            <Button variant={'outline'} className='w-full' onClick={handleDrawArea}> <Pencil /> Draw</Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
            <div className='w-full overflow-hidden rounded-xl'>
                <Map lat={location.lat} lng={location.lng} radius={radius} />

            </div>
        </div >
    )
}

const SearchBar = () => {
    const { searchQuery, setSearchQuery, setLocation } = useLocationStore()
    const { searchLoading, setSearchError, setSearchLoading, setError } = useAppStateStore()
    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();

        const activeElement = window.document.activeElement
        if (activeElement instanceof HTMLElement) {
            activeElement.blur()
        }
        if (!searchQuery.trim()) return;

        setSearchLoading(true);
        setSearchError(null);

        try {
            const result = await getLocationBySearchQuery(searchQuery)

            if (result) {
                setLocation({
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon),
                    accuracy: null
                });
                setSearchQuery(result.display_name);
                setError(null);
            } else {
                setSearchError('Address not found. Try another search.');
            }
        } catch (err) {
            console.error(err)
            setSearchError('Error searching for address. Please try again.');
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => handleSearch(e)}>
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <InputGroup>
                        <InputGroupInput type='search' value={searchQuery} enterKeyHint='search'
                            onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search a place, city or location..." />
                    </InputGroup>
                </div>
                <Button type="submit" variant={'outline'} disabled={searchLoading}>
                    {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search />}
                </Button>
            </div>

        </form>
    )
}