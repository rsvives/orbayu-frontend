import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { weatherService } from './services/weatherService'


function App() {
  const [count, setCount] = useState(0)

  const API_BASE_URL = 'http://localhost:8000/';

  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['health'],
    queryFn: () => weatherService.getWeather(),
  })

  if (query.isLoading) return <div>...Loading</div>
  if (query.isError) return <div>...Error</div>
  return (
    <>
      <h1>Weather data</h1>
      <pre>
        {JSON.stringify(query.data, null, 2)}
      </pre>
    </>
  )
}

export default App
