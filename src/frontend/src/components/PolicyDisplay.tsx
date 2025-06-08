import { Paper, Title, Text, Tabs, Stack, List } from '@mantine/core'

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

interface PolicyDisplayProps {
  publicPolicy: Policy
  moderatorPolicy: Policy
  machinePolicy: Policy
}

export function PolicyDisplay({ publicPolicy, moderatorPolicy, machinePolicy }: PolicyDisplayProps) {
  return (
    <Paper p="xl" radius="md" withBorder shadow="sm">
      <Tabs defaultValue="public">
        <Tabs.List>
          <Tabs.Tab value="public">Public Policy</Tabs.Tab>
          <Tabs.Tab value="moderator">Moderator Policy</Tabs.Tab>
          <Tabs.Tab value="machine">Machine Policy</Tabs.Tab>
        </Tabs.List>

        <Stack gap="md" mt="md">
          <Tabs.Panel value="public">
            <Stack gap="md">
              <Title order={3}>{publicPolicy.name}</Title>
              {publicPolicy.summary && (
                <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                  {publicPolicy.summary}
                </Text>
              )}
              {publicPolicy.rationale && (
                <>
                  <Title order={4}>Rationale</Title>
                  <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                    {publicPolicy.rationale}
                  </Text>
                </>
              )}
              {publicPolicy.scope && (
                <>
                  <Title order={4}>Scope</Title>
                  <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                    {publicPolicy.scope}
                  </Text>
                </>
              )}
              {publicPolicy.violation_examples && (
                <>
                  <Title order={4}>Violation Examples</Title>
                  <List>
                    {publicPolicy.violation_examples.map((example, index) => (
                      <List.Item key={index}>{example}</List.Item>
                    ))}
                  </List>
                </>
              )}
              {publicPolicy.non_violation_examples && (
                <>
                  <Title order={4}>Non-Violation Examples</Title>
                  <List>
                    {publicPolicy.non_violation_examples.map((example, index) => (
                      <List.Item key={index}>{example}</List.Item>
                    ))}
                  </List>
                </>
              )}
              {publicPolicy.faq && (
                <>
                  <Title order={4}>FAQ</Title>
                  <List>
                    {publicPolicy.faq.map((faq, index) => (
                      <List.Item key={index}>{faq}</List.Item>
                    ))}
                  </List>
                </>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="moderator">
            <Stack gap="md">
              <Title order={3}>{moderatorPolicy.name}</Title>
              {moderatorPolicy.description && (
                <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                  {moderatorPolicy.description}
                </Text>
              )}
              {moderatorPolicy.scope && (
                <>
                  <Title order={4}>Scope</Title>
                  <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                    {moderatorPolicy.scope}
                  </Text>
                </>
              )}
              {moderatorPolicy.rationale && (
                <>
                  <Title order={4}>Rationale</Title>
                  <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                    {moderatorPolicy.rationale}
                  </Text>
                </>
              )}
              {moderatorPolicy.violation_examples && (
                <>
                  <Title order={4}>Violation Examples</Title>
                  <List>
                    {moderatorPolicy.violation_examples.map((example, index) => (
                      <List.Item key={index}>{example}</List.Item>
                    ))}
                  </List>
                </>
              )}
              {moderatorPolicy.non_violation_examples && (
                <>
                  <Title order={4}>Non-Violation Examples</Title>
                  <List>
                    {moderatorPolicy.non_violation_examples.map((example, index) => (
                      <List.Item key={index}>{example}</List.Item>
                    ))}
                  </List>
                </>
              )}
              {moderatorPolicy.edge_case_notes && (
                <>
                  <Title order={4}>Edge Case Notes</Title>
                  <List>
                    {moderatorPolicy.edge_case_notes.map((note, index) => (
                      <List.Item key={index}>{note}</List.Item>
                    ))}
                  </List>
                </>
              )}
              {moderatorPolicy.enforcement_guidance && (
                <>
                  <Title order={4}>Enforcement Guidance</Title>
                  <List>
                    {moderatorPolicy.enforcement_guidance.map((guidance, index) => (
                      <List.Item key={index}>{guidance}</List.Item>
                    ))}
                  </List>
                </>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="machine">
            <Stack gap="md">
              <Title order={3}>{machinePolicy.name}</Title>
              {machinePolicy.description && (
                <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                  {machinePolicy.description}
                </Text>
              )}
              {machinePolicy.scope && (
                <>
                  <Title order={4}>Scope</Title>
                  <Text size="md" style={{ whiteSpace: 'pre-wrap' }}>
                    {machinePolicy.scope}
                  </Text>
                </>
              )}
              {machinePolicy.violation_criteria && (
                <>
                  <Title order={4}>Violation Criteria</Title>
                  <List>
                    {machinePolicy.violation_criteria.map((criteria, index) => (
                      <List.Item key={index}>{criteria}</List.Item>
                    ))}
                  </List>
                </>
              )}
              {machinePolicy.non_violation_examples && (
                <>
                  <Title order={4}>Non-Violation Examples</Title>
                  <List>
                    {machinePolicy.non_violation_examples.map((example, index) => (
                      <List.Item key={index}>{example}</List.Item>
                    ))}
                  </List>
                </>
              )}
              {machinePolicy.edge_case_guidance && (
                <>
                  <Title order={4}>Edge Case Guidance</Title>
                  <List>
                    {machinePolicy.edge_case_guidance.map((guidance, index) => (
                      <List.Item key={index}>{guidance}</List.Item>
                    ))}
                  </List>
                </>
              )}
            </Stack>
          </Tabs.Panel>
        </Stack>
      </Tabs>
    </Paper>
  )
} 