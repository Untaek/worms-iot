import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/index.tsx'
import { UserProvider } from './providers/user.provider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from './components/ui/toaster.tsx'
import { Toaster as Sooner } from './components/ui/sonner.tsx'
import axios from 'axios'

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:3000'
}

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster />
        <Sooner />
      </UserProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
