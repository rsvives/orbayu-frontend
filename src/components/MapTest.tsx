import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Search, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { DatesSection } from './DatesSection';
import { weatherService } from '@/services/weatherService';
import { useQueryClient } from '@tanstack/react-query';

export default function LocationMap() {
    const [location, setLocation] = useState({ lat: null, lng: null, accuracy: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [locationName, setLocationName] = useState('Your current location');
    const initialLocation = useRef(null);
    const [radius, setRadius] = useState(50);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    initialLocation.current = currentLocation;
                    setLocation(currentLocation);
                    setLocationName('Your current location');
                    setLoading(false);
                },
                (err) => {
                    setError(err.message);
                    setLoading(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            setError('Geolocation unavailable');
            setLoading(false);

        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearchLoading(true);
        setSearchError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const result = data[0];
                setLocation({
                    lat: parseFloat(result.lat),
                    lng: parseFloat(result.lon),
                    accuracy: null
                });
                setLocationName(result.display_name);
                setSearchQuery(result.display_name)
                setError(null);
            } else {
                setSearchError('Address not found. Try another search.');
            }
        } catch (err) {
            setSearchError('Error searching for address. Please try again.');
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        if (error) {
            toast("Geolocation unavailable", {
                description: "Please check your device location settings and try again.",
                duration: 10000,
                dismissible: true,
                cancel: <Button variant="outline" onClick={() => toast.dismiss()}>Close</Button>,
                action: <Button onClick={handleRefresh}>Retry</Button>
            })

        }
    }, [error])

    const handleRefresh = () => {
        if (initialLocation.current) {
            setLocation(initialLocation.current);
            setLocationName('Your current location');
            setSearchQuery('');
            setError(null);
            setSearchError(null);
        } else {
            setLoading(true);
            setError(null);
            setSearchQuery('');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    initialLocation.current = currentLocation;
                    setLocation(currentLocation);
                    setLocationName('Your current location');
                    setLoading(false);
                },
                (err) => {
                    setError(err.message);
                    setLoading(false);
                }
            );
        }
    };
    const handleRadiusChange = (value: number[]) => {
        // console.log(value[0]);
        setRadius(value[0]);
    }
    const handleDrawArea = () => {
        toast('Feature not available yet', {
            duration: 5000,
            dismissible: true,
            action: { label: 'Close', onClick: () => toast.dismiss() }
        })
    }





    // if (query.isLoading) return <div>...Loading</div>
    // if (query.isError) return <div>...Error</div>
    // console.log(query.data) 
    return (
        // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        < div className="max-w-4xl mx-auto" >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                {JSON.stringify(location)}

                {/* Content */}
                <div className="p-6">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-6">
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
                    </form>

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                            <p className="text-gray-600">Getting your location...</p>
                        </div>
                    )}

                    {location && !loading && (
                        <div className="space-y-6">
                            {/* Location Name */}

                            {/* Map */}
                            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
                                <Button variant={'outline'} className='absolute top-3 right-3' onClick={handleDrawArea}> <Pencil /> </Button>
                                {/* <LocationCard /> */}
                                <iframe
                                    width="100%"
                                    height="600"
                                    frameBorder="0"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
                                    className="w-full"
                                />
                                <DatesSection lat={location.lat} lon={location.lng} radius={radius} />
                            </div>


                        </div>
                    )}
                </div>
            </div>


        </div >
    );
}

const LocationCard = () => {
    return (
        <div className="absolute top-3 left-16 right-4 sm:right-8 flex gap-4 flex-col sm:flex-row">
            <Card className='w-full sm:w-1/2 p-2 flex flex-row items-start  gap-2'>
                <CardHeader className='p-2 flex-1'>
                    <CardTitle className='flex items-center gap-2 text-sm'><MapPin className="h-3 w-3" />Location</CardTitle>
                    <CardDescription className='overflow-hidden text-ellipsis line-clamp-1'>{locationName}</CardDescription>
                </CardHeader>
                <div className='flex gap-2 items-center'>
                    <Slider className='sm:hidden w-20' defaultValue={[50]} max={100} min={1} step={5} onValueChange={handleRadiusChange} />
                    <Button variant={'outline'} className='sm:hidden' onClick={handleDrawArea}> <Pencil /> </Button>

                </div>
            </Card>
            <div className='w-full sm:w-1/2 flex gap-4 '>
                <Card className='hidden sm:flex w-full sm:w-1/2 p-2'>
                    <CardHeader className='p-2 flex-1'>
                        <CardTitle className='flex items-center justify-between gap-2 text-sm'>Radius   <span className='text-md font-medium'>{radius} km</span></CardTitle>
                        <CardDescription className='flex flex-1 items-center gap-2 text-sm justify-center flex-col gap-2'>

                            <Slider defaultValue={[50]} max={100} min={1} step={5} onValueChange={handleRadiusChange} />
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card className='hidden sm:flex sm:w-1/2 p-2'>
                    <CardHeader className=' flex flex-col p-2'>
                        <CardTitle className='flex items-center gap-2 text-sm'>Draw your own area</CardTitle>
                        <CardDescription className='flex w-full justify-center gap-2 text-sm'>
                            <Button variant={'outline'} className='w-full' onClick={handleDrawArea}> <Pencil /> Draw</Button>
                        </CardDescription>
                    </CardHeader>
                </Card>

            </div>
        </div >
    )
}