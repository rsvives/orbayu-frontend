import { toast } from 'sonner';
import './App.css'
import { DatesSection } from './components/DatesSection'
import { DrawerDialog } from './components/DrawerDialog'
import { LocationSection } from './components/location/LocationSection'
import { Button } from './components/ui/button';
import { getCurrentLocation, getLocationByCoords } from './lib/location';
import { useEffect, useRef, useState } from 'react';
import { formatDate } from './lib/dates';
import { weatherService } from './services/weatherService';
import { useQuery } from '@tanstack/react-query';
import { useLocationStore } from './store/locationStore';
import { useAppStateStore } from './store/appStateStore';
import { useWeatherDataStore } from './store/weatherDataStore';
import { useDatesStore } from './store/datesStore';


function App() {
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

  return (
    <>
      <div className="max-w-4xl mx-auto" >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 pt-2 sm:p-6 flex flex-col gap-4" >
            <LocationSection />
            <div className="space-y-6">
              <DatesSection handleCheckWeatherQuery={() => weatherCheckData.refetch()} dataPending={weatherCheckData.isFetching} />
              <DrawerDialog data={weatherData} open={drawerDialogOpen} setOpen={setDrawerDialogOpen} />
            </div>
          </div >
        </div>
      </div>
    </>
  )
}

export default App
