import { useMediaQuery } from "@/hooks/use-media-query"
import { useAppStateStore } from "@/store/appStateStore"
import { useLocationStore } from "@/store/locationStore"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Loader2, MapPin, Pencil, Search } from "lucide-react"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Map } from "../Map"
import { InputGroup, InputGroupInput } from "../ui/input-group"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useEffect, type FormEvent } from "react"


export const LocationForm = () => {
    // const initialLocation = useRef<{ lat: number | null, lng: number | null, accuracy: number | null } | null>(null);

    const { location, radius, setRadius } = useLocationStore()
    const { searchError } = useAppStateStore()
    const isMobile = useMediaQuery('(max-width: 768px)')


    const handleRadiusChange = (value: number[]) => {
        setRadius(value[0]);
    }

    const handleDrawArea = () => {
        toast('Feature not available yet', {
            duration: 5000,
            dismissible: true,
            action: { label: 'Close', onClick: () => toast.dismiss() }
        })
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
                        <Map lat={location?.coords.lat} lng={location?.coords.lng} radius={radius} />
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
                <Map lat={location?.coords?.lat} lng={location?.coords?.lng} radius={radius} />

            </div>
        </div >
    )
}


const SearchBar = () => {
    const { searchQuery, location, setSearchQuery, setLocation, setShouldSearch } = useLocationStore()
    const { searchLoading, setSearchError, setSearchLoading } = useAppStateStore()

    // const [shouldSearch, setShouldSearch] = useState(false)


    const handleSearch = async (e: FormEvent) => {
        e.preventDefault();

        const activeElement = window.document.activeElement
        if (activeElement instanceof HTMLElement) {
            activeElement.blur()
        }
        if (!searchQuery.trim()) return


        //TODO remove this
        setSearchLoading(true)
        setSearchError(null)


        setShouldSearch(true)

        // try {
        //     const result = await getLocationBySearchQuery(searchQuery)

        //     if (result) {
        //         setLocation({
        //             lat: parseFloat(result.lat),
        //             lng: parseFloat(result.lon),
        //             accuracy: null
        //         });
        //         setSearchQuery(result.display_name);
        //         setError(null);
        //     } else {
        //         setSearchError('Address not found. Try another search.');
        //     }
        // } catch (err) {
        //     console.error(err)
        //     setSearchError('Error searching for address. Please try again.');
        // } finally {
        //     setSearchLoading(false);
        // }

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // console.log('change', e.target.value)
        if (e.target.value.trim() === '') {
            setLocation(null)
            setSearchQuery('')
        }
        setShouldSearch(false)
        setSearchQuery(e.target.value)
    }

    useEffect(() => {
        if (location) {
            // setLocation(location)
            // setSearchLoading(false)
            setShouldSearch(false)
            setSearchQuery(location?.name || '')
        }
    }, [location])


    return (
        <form onSubmit={(e) => handleSearch(e)}>
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <InputGroup>
                        <InputGroupInput type='search' value={searchQuery} enterKeyHint='search'
                            onChange={handleChange} placeholder="Search a place, city or location..." />
                    </InputGroup>
                </div>
                <Button type="submit" variant={'outline'} disabled={searchLoading}>
                    {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search />}
                </Button>
            </div>

        </form>
    )
}