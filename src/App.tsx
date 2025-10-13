import { toast } from 'sonner'
import './App.css'
import { DatesSection } from './components/DatesSection'
import { DrawerDialog } from './components/DrawerDialog'
import { LocationSection } from './components/location/LocationSection'
import { Button } from './components/ui/button'
import { useEffect, useState } from 'react'
import { formatDate } from './lib/dates'
import { weatherService } from './services/weatherService'
import { useQuery } from '@tanstack/react-query'
import { useLocationStore } from './store/locationStore'
import { useAppStateStore } from './store/appStateStore'
import { useWeatherDataStore } from './store/weatherDataStore'
import { useDatesStore } from './store/datesStore'
import { useGeolocation } from './hooks/location/useGeolocation'
import { useLocationByCoords } from './hooks/location/useLocationByCoords'
import { useLocationBySearch } from './hooks/location/useLocationBySearch'


function App() {
  const [drawerDialogOpen, setDrawerDialogOpen] = useState(false)


  const { searchQuery, shouldSearch, location, radius, setLocation } = useLocationStore()
  const { error, setError, setSearchLoading } = useAppStateStore()
  const { weatherData, setWeatherData } = useWeatherDataStore()
  const { startDate, endDate } = useDatesStore()

  const weatherCheckData = useQuery({
    queryKey: ['weather', location?.coords?.lat, location?.coords?.lng, radius, startDate, endDate],
    queryFn: async () => await weatherService.getWeather({
      lat: location?.coords?.lat,
      lon: location?.coords?.lng, radius,
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

  // Error handler
  useEffect(() => {
    if (error) {
      toast.error("Geolocation unavailable", {
        description: "Please check your device location settings and try again.",
        classNames: { error: 'bg-red-500 text-white' },
        duration: 10000,
        dismissible: true,
        cancel: <Button variant="outline" onClick={() => toast.dismiss()}>Close</Button>,
        // action: <Button onClick={handleRefresh}>Retry</Button>
        // action: <Button onClick={() => { }}>Retry</Button>
      })
    }
  }, [error])


  const {
    data: coords,
    error: geoError
  } = useGeolocation()

  const {
    data: autoLocation,
    error: autoError
  } = useLocationByCoords(coords?.lat ?? undefined, coords?.lng ?? undefined)

  const {
    data: searchLocation,
    error: searchError,
    isFetching: searchIsFetching
  } = useLocationBySearch(searchQuery, shouldSearch)


  const displayLocation = searchLocation
  const displayError = searchError || autoError || geoError

  useEffect(() => {
    setLocation(autoLocation)
  }, [autoLocation])

  useEffect(() => {
    if (searchLocation) {
      setLocation(searchLocation)
    }

    if (displayError) {
      setError(displayError.message)
    } else {
      setError(null)
    }

    setSearchLoading(searchIsFetching)
    console.log({ displayLocation }, { displayError })
  }, [searchLocation, displayError, searchIsFetching])

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
