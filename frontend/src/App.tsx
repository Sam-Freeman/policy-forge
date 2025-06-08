import { Container, Stack, Title, Alert, Box, Stepper, Grid, rem, Paper } from '@mantine/core'
import { useState } from 'react'
import { IntentForm } from './components/IntentForm'
import { PolicyDisplay } from './components/PolicyDisplay'
import { apiFetch } from './api'

interface Policy {
  name: string
  description?: string
  summary?: string
  rationale?: string
  scope?: string
  violation_examples?: string[]
  non_violation_examples?: string[]
  faq?: string[]
  edge_case_notes?: string[]
  enforcement_guidance?: string[]
  severity?: string
  violation_criteria?: string[]
  edge_case_guidance?: string[]
  output_format?: {
    type: string
    labels: string[]
    confidence_required: boolean
  }
}

const steps = [
  { label: 'Define Intent', description: 'Describe your policy scenario' },
  { label: 'Review Policies', description: 'View and analyze generated policies' },
]

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [policies, setPolicies] = useState<{
    public: Policy
    moderator: Policy
    machine: Policy
  } | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const handleIntentSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)
    try {
      // First, submit the intent
      const intentResponse = await apiFetch('/api/intent/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!intentResponse.ok) {
        throw new Error('Failed to submit intent')
      }

      const enrichedIntent = await intentResponse.json()
      console.log('Enriched intent:', enrichedIntent)

      // Then, generate policies using the enriched intent
      const policyResponse = await apiFetch('/api/policy/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ intent: enrichedIntent.intent }),
      })

      if (!policyResponse.ok) {
        throw new Error('Failed to generate policies')
      }

      const policyData = await policyResponse.json()
      console.log('Policy data:', policyData)

      setPolicies(policyData)
      setCurrentStep(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box bg="#eaf6f4" mih="100vh" py="xl">
      <Container size="lg">
        <Paper radius="lg" p={0} style={{ overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.04)' }}>
          <Grid gutter={0}>
            {/* Stepper column */}
            <Grid.Col span={{ base: 12, md: 4 }} style={{ background: '#f7fafc', minHeight: rem(600), padding: rem(32) }}>
              <Stack>
                <Title order={3} c="mint.7" mb="lg" style={{ letterSpacing: 1 }}>Create account</Title>
                <Stepper active={currentStep} orientation="vertical" size="md" iconSize={32} allowNextStepsSelect={false} color="mint">
                  {steps.map((step, idx) => (
                    <Stepper.Step key={step.label} label={step.label} description={step.description} />
                  ))}
                </Stepper>
              </Stack>
            </Grid.Col>
            {/* Content column */}
            <Grid.Col span={{ base: 12, md: 8 }} style={{ background: '#fff', padding: rem(40) }}>
              <Stack>
                <Title order={1} ta="left" c="mint.7" mb="md" style={{ fontWeight: 600, letterSpacing: 1 }}>
                  {steps[currentStep].label}
                </Title>
                {currentStep === 0 && (
                  <>
                    {error && (
                      <Alert color="red" title="Error" variant="filled" mb="md">
                        {error}
                      </Alert>
                    )}
                    <IntentForm 
                      onSubmit={handleIntentSubmit} 
                      isLoading={isLoading} 
                      disabled={currentStep > 0}
                    />
                  </>
                )}
                {currentStep === 1 && policies && (
                  <PolicyDisplay
                    publicPolicy={policies.public}
                    moderatorPolicy={policies.moderator}
                    machinePolicy={policies.machine}
                  />
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}

export default App
