import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { AppRouter } from './routes/root';
import { AuthProvider } from "@/context/AuthContext"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter></AppRouter>
    </AuthProvider>
  </StrictMode>,
)
