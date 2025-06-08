import { Container, Stack, Title, Alert, Box, Stepper, Grid, rem, Paper, Button, Loader, Overlay } from '@mantine/core'
import { ForgeProvider, useForge } from './ForgeContext'
import { IntentForm } from './IntentForm'
import { PolicyDisplay } from './PolicyDisplay'
import { ExampleLabeler } from './ExampleLabeler'
import { DownloadPolicies } from './DownloadPolicies'

function ForgeSteps() {
  const {
    step, error, isLoading, generateExamples, refinePoliciesAction, nextStep
  } = useForge()

  const steps = [
    { label: 'Define Intent', description: 'Describe your policy scenario' },
    { label: 'Review Policies', description: 'View and analyse generated policies' },
    { label: 'Label Examples', description: 'Label synthetic examples' },
    { label: 'Review Refined Policies', description: 'View refined policies that were updated based on your feedback' },
    { label: 'Download Policies', description: 'Download your policies' },
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
            <Grid.Col span={{ base: 12, md: 8 }} style={{ background: '#fff', padding: rem(40), position: 'relative' }}>
              {isLoading && (
                <>
                  <Overlay blur={2} opacity={0.3} />
                  <Box
                    pos="absolute"
                    top="50%"
                    left="50%"
                    style={{
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1000,
                    }}
                  >
                    <Stack align="center" gap="md">
                      <Loader size="xl" color="mint" />
                    </Stack>
                  </Box>
                </>
              )}
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
                    <ExampleLabeler />
                    <Button mt="xl" color="mint" onClick={refinePoliciesAction}>
                      Refine Policies
                    </Button>
                  </>
                )}
                {step === 3 && (
                  <>
                    <PolicyDisplay />
                    <Button mt="xl" color="mint" onClick={nextStep}>
                      Continue
                    </Button>
                  </>
                )}
                {step === 4 && (
                  <DownloadPolicies />
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