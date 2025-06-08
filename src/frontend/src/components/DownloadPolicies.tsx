import { Box, Button, Stack, Title, Text } from '@mantine/core'
import { useForge } from './ForgeContext'
import JSZip from 'jszip'

function renderMarkdownSection(title: string, policy: any) {
  if (!policy) return ''
  return `# ${title}\n\n${Object.entries(policy)
    .filter(([key]) => key !== 'name')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `## ${key}\n${value.map((v) => `- ${v}`).join('\n')}`
      }
      return `## ${key}\n${value}`
    })
    .join('\n\n')}`
}

export function DownloadPolicies() {
  const { machinePolicy, publicPolicy, moderatorPolicy } = useForge()
  if (!machinePolicy || !publicPolicy || !moderatorPolicy) return null

  const handleDownload = async () => {
    const zip = new JSZip();

    // Create markdown files for each policy
    const publicPolicyMd = renderMarkdownSection('Public Policy', publicPolicy);
    const moderatorPolicyMd = renderMarkdownSection('Moderator Guidance', moderatorPolicy);
    const machinePolicyMd = renderMarkdownSection('Machine Policy', machinePolicy);

    // Add files to zip
    zip.file('public-policy.md', publicPolicyMd);
    zip.file('moderator-policy.md', moderatorPolicyMd);
    zip.file('machine-policy.md', machinePolicyMd);

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'policies.zip';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box mt="xl">
      <Stack align="center" gap="xl">
        <Title order={2} c="mint.7" ta="center">Your policies are ready!</Title>
        <Text size="lg" c="dimmed" ta="center">
          Download your complete policy package containing all three policy documents.
        </Text>
        <Button
          size="lg"
          color="mint"
          onClick={handleDownload}
          style={{ minWidth: 200 }}
        >
          Download Policies
        </Button>
      </Stack>
    </Box>
  )
} 