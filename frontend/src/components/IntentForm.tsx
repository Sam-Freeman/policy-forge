import { TextInput, Select, Textarea, Button, Stack, Paper, Title } from '@mantine/core'
import { useForm } from '@mantine/form'

interface IntentFormData {
  platform_type: string
  industry: string
  user_behavior: string
  real_world_concerns: string
  moderation_style: string
  additional_context: string
}

interface IntentFormProps {
  onSubmit: (data: IntentFormData) => void
  isLoading?: boolean
  disabled?: boolean
}

export function IntentForm({ onSubmit, isLoading, disabled }: IntentFormProps) {
  const form = useForm<IntentFormData>({
    initialValues: {
      platform_type: '',
      industry: '',
      user_behavior: '',
      real_world_concerns: '',
      moderation_style: '',
      additional_context: '',
    },
  })

  return (
    <Paper p="xl" radius="md" withBorder shadow="sm">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <Select
            label="Platform Type"
            placeholder="Select platform type"
            data={[
              'Social Media',
              'E-commerce',
              'Gaming',
              'Professional Network',
              'Other'
            ]}
            required
            disabled={disabled}
            {...form.getInputProps('platform_type')}
          />
          
          <Select
            label="Industry"
            placeholder="Select industry"
            data={[
              'Technology',
              'Entertainment',
              'Education',
              'Healthcare',
              'Finance',
              'Other'
            ]}
            required
            disabled={disabled}
            {...form.getInputProps('industry')}
          />

          <Textarea
            label="Target Behavior"
            placeholder="Describe the behavior you want to moderate"
            required
            minRows={2}
            disabled={disabled}
            {...form.getInputProps('user_behavior')}
          />

          <Textarea
            label="Real-World Concerns"
            placeholder="Describe any real-world concerns or considerations"
            required
            minRows={2}
            disabled={disabled}
            {...form.getInputProps('real_world_concerns')}
          />

          <Select
            label="Moderation Style"
            placeholder="Select moderation approach"
            data={[
              'Strict',
              'Balanced',
              'Lenient',
              'Context-aware'
            ]}
            required
            disabled={disabled}
            {...form.getInputProps('moderation_style')}
          />

          <Textarea
            label="Additional Context"
            placeholder="Any additional context or requirements"
            minRows={2}
            disabled={disabled}
            {...form.getInputProps('additional_context')}
          />

          <Button type="submit" loading={isLoading} size="md" mt="md">
            Generate Policies
          </Button>
        </Stack>
      </form>
    </Paper>
  )
} 