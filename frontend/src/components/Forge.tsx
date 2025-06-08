import { useState } from 'react'
import { Container, Stack, Title, Alert, Box, Stepper, Grid, rem, Paper, Button } from '@mantine/core'
import { IntentForm } from './IntentForm'
import { PolicyDisplay } from './PolicyDisplay'
import { ExampleGenerator } from './ExampleGenerator'
import { apiFetch } from '../api'

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
  { label: 'Generate Examples', description: 'Create and review synthetic examples' },
]

export function Forge() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [policies, setPolicies] = useState<{
    public: Policy
    moderator: Policy
    machine: Policy
  } | null>(null)
  const [examples, setExamples] = useState<any[] | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const handleIntentSubmit = async (data: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const intentResponse = await apiFetch('/api/intent/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!intentResponse.ok) throw new Error('Failed to submit intent')
      const enrichedIntent = await intentResponse.json()
      const policyResponse = await apiFetch('/api/policy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: enrichedIntent.intent }),
      })
      if (!policyResponse.ok) throw new Error('Failed to generate policies')
      const policyData = await policyResponse.json()
      setPolicies(policyData)
      setCurrentStep(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateExamples = async () => {
    if (!policies) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/examples/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: policies.machine }),
      })
      if (!response.ok) throw new Error('Failed to generate examples')
      const data = await response.json()
      setExamples(data.examples)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const goToExamplesStep = async () => {
    setCurrentStep(2)
    await handleGenerateExamples()
  }

  return (
    <Box bg="#eaf6f4" mih="100vh" py="xl">
      <Container size="lg">
        <Paper radius="lg" p={0} style={{ overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.04)' }}>
          <Grid gutter={0}>
            <Grid.Col span={{ base: 12, md: 4 }} style={{ background: '#f7fafc', minHeight: rem(600), padding: rem(32) }}>
              <Stack>
                <Title order={3} c="mint.7" mb="lg" style={{ letterSpacing: 1 }}>Policy Workflow</Title>
                <Stepper active={currentStep} orientation="vertical" size="md" iconSize={32} allowNextStepsSelect={false} color="mint">
                  {steps.map((step, idx) => (
                    <Stepper.Step key={step.label} label={step.label} description={step.description} />
                  ))}
                </Stepper>
              </Stack>
            </Grid.Col>
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
                  <>
                    <PolicyDisplay
                      publicPolicy={policies.public}
                      moderatorPolicy={policies.moderator}
                      machinePolicy={policies.machine}
                    />
                    <Button mt="xl" color="mint" onClick={goToExamplesStep}>
                      Continue
                    </Button>
                  </>
                )}
                {currentStep === 2 && policies && (
                  <ExampleGenerator
                    policy={policies.machine}
                    examples={examples}
                    isLoading={isLoading}
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