import { useEffect } from 'react'
import { Paper, Title, Loader, Stack, Text, SegmentedControl, Group } from '@mantine/core'
import { useForge } from './ForgeContext'

const LABELS = [
  { label: 'Violating', value: 'violation', color: 'red' },
  { label: 'Borderline', value: 'borderline', color: 'yellow' },
  { label: 'Non-violating', value: 'non-violation', color: 'green' },
]

export function ExampleGenerator() {
  const { policies, examples, reviewedExamples, setReviewedExamples, isLoading } = useForge()

  // Keep local labels state in sync with reviewedExamples
  useEffect(() => {
    if (examples && reviewedExamples && reviewedExamples.length === examples.length) {
      // nothing to do, already synced
      return
    }
    if (examples) {
      setReviewedExamples(examples)
    }
    // eslint-disable-next-line
  }, [examples])

  const handleLabelChange = (idx: number, value: string) => {
    if (!reviewedExamples) return
    const updated = reviewedExamples.map((ex, i) => i === idx ? { ...ex, label: value } : ex)
    setReviewedExamples(updated)
  }

  return (
    <Paper p="xl" radius="md" withBorder shadow="sm">
      <Stack gap="md">
        {isLoading && <Loader color="mint" />}
        {reviewedExamples && (
          <Stack gap="lg" mt="md">
            {reviewedExamples.length === 0 && <Text>No examples generated yet.</Text>}
            {reviewedExamples.map((ex, idx) => {
              const selected = ex.label || 'borderline'
              const color = LABELS.find(l => l.value === selected)?.color || 'gray'
              return (
                <Paper key={idx} p="md" radius="sm" withBorder>
                  <Stack gap="sm">
                    <Text>{ex.text}</Text>
                    <Group>
                      <SegmentedControl
                        value={selected}
                        onChange={(val) => handleLabelChange(idx, val)}
                        data={LABELS.map(l => ({ label: l.label, value: l.value }))}
                        color={color as any}
                      />
                      <Text size="sm" c={color}>
                        {LABELS.find(l => l.value === selected)?.label}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
} 