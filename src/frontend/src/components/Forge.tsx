import { Container, Stack, Title, Alert, Box, Stepper, Grid, rem, Paper, Button } from '@mantine/core'
import { ForgeProvider, useForge } from './ForgeContext'
import { IntentForm } from './IntentForm'
import { PolicyDisplay } from './PolicyDisplay'
import { ExampleGenerator } from './ExampleGenerator'

function RefinePolicies() {
  const { refinedPolicies, refineLoading, refineError } = useForge()
  return (
    <Box>
      {refineLoading && <Alert color="mint" variant="light" mb="md">Refining policies...</Alert>}
      {refineError && <Alert color="red" title="Error" variant="filled" mb="md">{refineError}</Alert>}
      {refinedPolicies && (
        <Box mt="xl">
          <PolicyDisplay />
        </Box>
      )}
    </Box>
  )
}

function ForgeSteps() {
  const {
    step, error, isLoading, generateExamples, refinePoliciesAction
  } = useForge()

  const steps = [
    { label: 'Define Intent', description: 'Describe your policy scenario' },
    { label: 'Review Policies', description: 'View and analyse generated policies' },
    { label: 'Label Examples', description: 'Label synthetic examples' },
    { label: 'Refine Policies', description: 'Refine policies using reviewed examples' },
  ]

  return (
    <Box bg="#eaf6f4" mih="100vh" py="xl">
      <Container size="lg">
        <Paper radius="lg" p={0} style={{ overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.04)' }}>
          <Grid gutter={0}>
            <Grid.Col span={{ base: 12, md: 4 }} style={{ background: '#f7fafc', minHeight: rem(600), padding: rem(32) }}>
              <Stack>
                <Title order={3} c="mint.7" mb="lg" style={{ letterSpacing: 1 }}>Policy Workflow</Title>
                <Stepper active={step} orientation="vertical" size="md" iconSize={32} allowNextStepsSelect={false} color="mint">
                  {steps.map((stepObj) => (
                    <Stepper.Step key={stepObj.label} label={stepObj.label} description={stepObj.description} />
                  ))}
                </Stepper>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 8 }} style={{ background: '#fff', padding: rem(40) }}>
              <Stack>
                <Title order={1} ta="left" c="mint.7" mb="md" style={{ fontWeight: 600, letterSpacing: 1 }}>
                  {steps[step].label}
                </Title>
                {step === 0 && (
                  <>
                    {error && (
                      <Alert color="red" title="Error" variant="filled" mb="md">
                        {error}
                      </Alert>
                    )}
                    <IntentForm />
                  </>
                )}
                {step === 1 && (
                  <>
                    <PolicyDisplay />
                    <Button mt="xl" color="mint" onClick={generateExamples}>
                      Continue
                    </Button>
                  </>
                )}
                {step === 2 && (
                  <>
                    <ExampleGenerator />
                    <Button mt="xl" color="mint" onClick={refinePoliciesAction}>
                      Refine Policies
                    </Button>
                  </>
                )}
                {step === 3 && (
                  <RefinePolicies />
                )}
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}

export function Forge() {
  return (
    <ForgeProvider>
      <ForgeSteps />
    </ForgeProvider>
  )
} 