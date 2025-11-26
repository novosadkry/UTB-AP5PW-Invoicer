import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider"
import AppRouter from './router'
import './index.css'
import { AuthProvider } from "@/hooks/use-auth.tsx";
import { Toaster } from "@components/ui/sonner.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <AppRouter />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
