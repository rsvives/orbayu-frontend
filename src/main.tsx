import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from './components/Header.tsx'
import { Toaster } from 'sonner'
import { StrictMode } from 'react'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Header />
      <App />
      <Toaster position='bottom-center' />
    </QueryClientProvider>
  </StrictMode>
)
