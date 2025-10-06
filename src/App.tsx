import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { weatherService } from './services/weatherService'
import MapTest from './components/MapTest'
import { Logo } from './components/Logo/Logo'
import { Isotype } from './components/Logo/Isotype'
import { LogoLettering } from './components/Logo/LogoLettering'


function App() {

  return (
    <>
      {/* <h1>Weather data</h1> */}
      {/* <pre>
        {JSON.stringify(query.data, null, 2)}
      </pre> */}
      <MapTest />

    </>
  )
}

export default App
