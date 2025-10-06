import { useState, useEffect, useRef, type FormEvent } from 'react';
import { MapPin, Loader2, Search, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { InputGroup, InputGroupInput } from './ui/input-group';
import { DatesSection } from './DatesSection';
import { getCurrentLocation, getLocationByCoords, getLocationBySearchQuery } from '@/lib/location';
import { Map } from './Map';
import { DrawerDialog } from './DrawerDialog';
import { useMutation } from '@tanstack/react-query';
import { weatherService } from '@/services/weatherService';
import { formatDate } from '@/lib/dates';

export default function LocationMap() {
    const [location, setLocation] = useState<{ lat: number | null, lng: number | null, accuracy: number | null }>({ lat: null, lng: null, accuracy: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [radius, setRadius] = useState(30);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    // const [locationName, setLocationName] = useState('');
    const initialLocation = useRef<{ lat: number | null, lng: number | null, accuracy: number | null } | null>(null);
    const [drawerDialogOpen, setDrawerDialogOpen] = useState(false);

    useEffect(() => {
        handleRefresh()
    }, []);


    const mutation = useMutation({
        mutationFn: async (date: Date) => await weatherService.getWeather({ lat: location.lat, lon: location.lng, radius, start_date: formatDate(date), end_date: formatDate(date) }),
        onMutate() {
            setDrawerDialogOpen(true)
        },
        onSuccess: async () => {
            console.log("I'm first!")
            setDrawerDialogOpen(true)
        },
    })

    const handleCheckWeatherMutation = async (date: Date | undefined) => {
        if (date) {
            mutation.mutate(date)
        }
    }



    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();
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
                setLocationName(result.display_name);
                setSearchQuery(result.display_name);
                // setSearchQuery('');
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

    useEffect(() => {
        if (error) {
            console.log({ erroooooor: error })
            toast.error("Geolocation unavailable", {
                description: "Please check your device location settings and try again.",
                // position: 'top-left',
                // richColors: true,
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
            setLocationName('Your current location');
            setSearchQuery('');
            setError(null);
            setSearchError(null);
        } else {
            setLoading(true);
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
                    setLocationName(locationName.display_name);
                    setSearchQuery(locationName.display_name);
                    setLoading(false);
                }
            }
            catch (err) {
                console.error({ err })
                if (err instanceof Error) {
                    setError(err.message);

                }
                setLoading(false);
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


    const handleRadiusChange = (value: number[]) => {
        // console.log(value[0]);
        setRadius(value[0]);
    }
    // if (query.isLoading) return <div>...Loading</div>
    // if (query.isError) return <div>...Error</div>
    // console.log(query.data) 
    return (
        // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        < div className="max-w-4xl mx-auto" >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* {JSON.stringify(location)} */}

                {/* Content */}
                <div className="p-6 flex flex-col gap-4">
                    {/* Search Bar */}
                    {/* <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <InputGroup>
                                    <InputGroupInput type='text' value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search a place, city or location..." />
                                    <InputGroupAddon>
                                        <Search />
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                            <Button type="submit" variant={'outline'}>
                                {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Locate'}
                            </Button>
                        </div>
                        {searchError && (
                            <p className="mt-2 text-sm text-red-600">{searchError}</p>
                        )}
                    </form> */}
                    <div className='flex gap-4 flex-wrap sm:flex-nowrap'>
                        <LocationCard handleDrawArea={handleDrawArea} radius={radius} handleRadiusChange={handleRadiusChange} handleSearch={handleSearch} searchQuery={searchQuery} searchLoading={searchLoading} searchError={searchError} setSearchQuery={setSearchQuery} />
                    </div>

                    {/* {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-600">Getting your location...</p>
                        </div>
                    )} */}


                    {location && !loading && (
                        <div className="space-y-6">

                            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                                <div className='absolute z-10 top-3 left-16 right-4 flex gap-4 '>
                                    {/* <Card className='p-2 flex-1 rounded-md shadow-none border-1'>
                                        <CardContent className='px-2 text-sm text-muted-foreground'>
                                            {searchError || error &&
                                                <p className="text-sm text-red-600 text-center">{searchError ?? error?.message}</p>
                                            }
                                        </CardContent>
                                    </Card> */}
                                    {/* <Button variant={'outline'} onClick={handleDrawArea}> <Pencil /> </Button> */}

                                </div>
                                {/* <div className="absolute top-3 left-16 right-4 sm:right-8 flex gap-4 flex-col sm:flex-row">
                                    <LocationCard locationName={locationName} handleDrawArea={handleDrawArea} radius={radius} handleRadiusChange={handleRadiusChange} />
                                </div> */}

                                <Map lat={location.lat} lng={location.lng} radius={radius} />

                                {/* // <Skeleton className="h-[600px] w-full rounded-md" /> */}

                            </div>
                            <DatesSection handleCheckWeatherMutation={handleCheckWeatherMutation} mutationPending={mutation.isPending} />

                            <DrawerDialog open={drawerDialogOpen} setOpen={setDrawerDialogOpen} />
                        </div>
                    )}
                </div>
            </div>


        </div >
    );
}

const LocationCard = ({ handleDrawArea, radius, handleRadiusChange, handleSearch, searchQuery, searchLoading, setSearchQuery }: { handleDrawArea: () => void, radius: number, handleRadiusChange: (value: number[]) => void, handleSearch: (e: FormEvent) => void, searchQuery: string, searchLoading: boolean, setSearchQuery: (value: string) => void }) => {



    return (
        <>
            <Card className='w-full md:w-1/2 gap-2 p-2'>
                <CardHeader className='px-2'>
                    <CardTitle className='flex items-center gap-2 text-sm'>
                        <MapPin className="h-3 w-3" />
                        <h3>Location</h3>
                    </CardTitle>

                </CardHeader>
                <CardContent className='px-2' >
                    {/* {locationName} */}
                    <form onSubmit={(e) => handleSearch(e)}>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <InputGroup>
                                    <InputGroupInput type='text' value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search a place, city or location..." />
                                    {/* <InputGroupAddon>
                                        <Search />
                                    </InputGroupAddon> */}
                                </InputGroup>
                            </div>
                            <Button type="submit" variant={'outline'}>
                                {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search />}
                            </Button>
                        </div>

                    </form>
                </CardContent>
                {/* <CardFooter>

                </CardFooter> */}
            </Card>
            <div className='w-full sm:w-1/3 md:w-1/2 flex gap-4 '>
                <Card className='w-full  md:w-1/2 gap-2 p-2'>
                    <CardHeader className='px-2'>
                        <CardTitle className='flex items-center justify-between gap-2 text-sm'>
                            <h3>Radius</h3>
                            <h3 className='text-md font-medium'>{radius} km</h3>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='flex items-center gap-2 text-sm justify-center flex-1 px-2'>
                        <div className='w-full h-4 '>
                            <Slider defaultValue={[radius]} max={100} min={1} step={5} onValueChange={handleRadiusChange} />
                        </div>
                    </CardContent>
                    {/* <CardFooter>

                    </CardFooter> */}
                </Card>
                <Card className='hidden md:flex sm:w-1/2 gap-2 p-2'>
                    <CardHeader className='px-2'>
                        <CardTitle className='flex items-center justify-between gap-2 text-sm'>Draw your own area</CardTitle>
                    </CardHeader>
                    <CardContent className='flex items-center text-sm px-2'>
                        <Button variant={'outline'} className='w-full' onClick={handleDrawArea}> <Pencil /> Draw</Button>
                    </CardContent>
                    {/* <CardFooter>

                    </CardFooter> */}
                </Card>
            </div>
        </ >
    )
}