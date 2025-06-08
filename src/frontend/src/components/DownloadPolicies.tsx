import { Box, Title, Button, Stack, Text } from '@mantine/core'
import { useForge } from './ForgeContext'
import JSZip from 'jszip'

function renderMarkdownSection(title: string, fields: Record<string, any>) {
  let md = `# ${title}\n\n`;
  for (const [key, value] of Object.entries(fields)) {
    if (key === 'name') continue;
    if (typeof value === 'string' && value.trim()) {
      md += `## ${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}\n\n${value}\n\n`;
    } else if (Array.isArray(value) && value.length > 0) {
      md += `## ${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}\n`;
      for (const item of value) {
        md += `- ${item}\n`;
      }
      md += '\n';
    }
  }
  return md;
}

export function DownloadPolicies() {
  const { refinedPolicies, policies } = useForge()
  const current = refinedPolicies || policies
  if (!current) return null

  const handleDownload = async () => {
    const zip = new JSZip();

    // Create markdown files for each policy
    const publicPolicy = renderMarkdownSection('Public Policy', current.public);
    const moderatorPolicy = renderMarkdownSection('Moderator Policy', current.moderator);
    const machinePolicy = renderMarkdownSection('Machine Policy', current.machine);

    // Add files to zip
    zip.file('public-policy.md', publicPolicy);
    zip.file('moderator-policy.md', moderatorPolicy);
    zip.file('machine-policy.md', machinePolicy);

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