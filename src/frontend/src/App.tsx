import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Button, Center, Stack, Title, Box } from '@mantine/core'
import { Forge } from './components/Forge'

function LandingPage() {
  const navigate = useNavigate()
  return (
    <Center mih="100vh" bg="#eaf6f4">
      <Stack align="center" gap="xl">
        <Title order={1} c="mint.7" style={{ fontWeight: 700, letterSpacing: 1 }}>Policy Forge</Title>
        <Button size="xl" color="mint" radius="xl" onClick={() => navigate('/forge')}>
          Forge Your Policy
        </Button>
      </Stack>
    </Center>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/forge" element={<Forge />} />
      </Routes>
    </BrowserRouter>
  )
}
