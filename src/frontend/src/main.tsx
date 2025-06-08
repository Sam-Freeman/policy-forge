import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/tiptap/styles.css';
import App from './App.tsx'

const theme = createTheme({
  primaryColor: 'mint',
  fontFamily: 'Inter, sans-serif',
  colors: {
    mint: [
      '#f7fafc', // 0 (for backgrounds)
      '#eaf6f4', // 1 (main accent)
      '#d2ede7', // 2
      '#b8e3da', // 3
      '#9fd7cb', // 4
      '#86cbbc', // 5
      '#6dbfad', // 6
      '#54b39e', // 7
      '#3ba78f', // 8
      '#229b80', // 9
    ],
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
)
