import { TextInput, Select, Textarea, Button, Stack, Paper, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useForge } from './ForgeContext'

export function IntentForm() {
  const { submitIntent, isLoading, step } = useForge()
  const form = useForm({
    initialValues: {
      platform_type: '',
      industry: '',
      user_behavior: '',
      real_world_concerns: '',
      moderation_style: '',
      additional_context: '',
    },
  })

  const isDisabled = step > 0 || isLoading
  
  return (
    <Paper p="xl" radius="md" withBorder shadow="sm">
      <form onSubmit={form.onSubmit(submitIntent)}>
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
            disabled={isDisabled}
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
            disabled={isDisabled}
            {...form.getInputProps('industry')}
          />
          <Textarea
            label="Target Behavior"
            placeholder="Describe the behavior you want to moderate"
            required
            minRows={2}
            disabled={isDisabled}
            {...form.getInputProps('user_behavior')}
          />
          <Textarea
            label="Real-World Concerns"
            placeholder="Describe any real-world concerns or considerations"
            required
            minRows={2}
            disabled={isDisabled}
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
            disabled={isDisabled}
            {...form.getInputProps('moderation_style')}
          />
          <Textarea
            label="Additional Context"
            placeholder="Any additional context or requirements"
            minRows={2}
            disabled={isDisabled}
            {...form.getInputProps('additional_context')}
          />
          <Button type="submit" disabled={isDisabled} size="md" mt="md">
            Generate Policies
          </Button>
        </Stack>
      </form>
    </Paper>
  )
} 