import { useState, useEffect } from 'react'
import { Paper, Title, Loader, Stack, Text, SegmentedControl, Group } from '@mantine/core'

interface ExampleGeneratorProps {
  policy: any
  examples: any[] | null
  isLoading: boolean
}

const LABELS = [
  { label: 'Violating', value: 'violation', color: 'red' },
  { label: 'Borderline', value: 'borderline', color: 'yellow' },
  { label: 'Non-violating', value: 'non-violation', color: 'green' },
]

export function ExampleGenerator({ policy, examples, isLoading }: ExampleGeneratorProps) {
  const [labels, setLabels] = useState<Record<number, string>>({})

  // Set initial labels from API response
  useEffect(() => {
    if (examples) {
      const initialLabels: Record<number, string> = {}
      examples.forEach((ex, idx) => {
        initialLabels[idx] = ex.label
      })
      setLabels(initialLabels)
    }
  }, [examples])

  const handleLabelChange = (idx: number, value: string) => {
    setLabels((prev) => ({ ...prev, [idx]: value }))
  }

  return (
    <Paper p="xl" radius="md" withBorder shadow="sm">
      <Stack gap="md">
        {isLoading && <Loader color="mint" />}
        {examples && (
          <Stack gap="lg" mt="md">
            {examples.length === 0 && <Text>No examples generated yet.</Text>}
            {examples.map((ex, idx) => {
              const selected = labels[idx] || 'borderline'
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