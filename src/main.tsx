import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {QueryClient} from '@tanstack/react-query'
import './index.css'
import App from './components/App/App.tsx'
const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
