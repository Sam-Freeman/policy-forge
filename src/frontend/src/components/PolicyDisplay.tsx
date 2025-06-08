import { useState } from 'react'
import { Paper, Title, Text, Stack, List, Button, Group, Box, TextInput, ActionIcon, Tabs } from '@mantine/core'
import { useForge } from './ForgeContext'
import type { Policy } from './ForgeContext'
import { RichTextEditor } from '@mantine/tiptap'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { IconPlus, IconTrash } from '@tabler/icons-react'

const POLICY_FIELDS: Record<string, { label: string; type: 'markdown' | 'list' }> = {
  summary: { label: 'Summary', type: 'markdown' },
  rationale: { label: 'Rationale', type: 'markdown' },
  scope: { label: 'Scope', type: 'markdown' },
  violation_examples: { label: 'Violation Examples', type: 'list' },
  non_violation_examples: { label: 'Non-Violation Examples', type: 'list' },
  faq: { label: 'FAQ', type: 'list' },
  description: { label: 'Description', type: 'markdown' },
  edge_case_notes: { label: 'Edge Case Notes', type: 'list' },
  enforcement_guidance: { label: 'Enforcement Guidance', type: 'list' },
  violation_criteria: { label: 'Violation Criteria', type: 'list' },
  edge_case_guidance: { label: 'Edge Case Guidance', type: 'list' },
}

type PolicyType = 'public' | 'moderator' | 'machine'

function EditableField<T extends string | string[]>({
  which,
  field,
  value,
  type,
  onSave,
}: {
  which: PolicyType
  field: string
  value: T
  type: 'markdown' | 'list'
  onSave: (val: T) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState<T>(value)
  const editor = useEditor({
    extensions: [StarterKit],
    content: typeof editValue === 'string' ? editValue : '',
    onUpdate: ({ editor }) => {
      setEditValue(editor.getHTML() as T)
    },
  })

  const handleSave = () => {
    if (type === 'markdown' && editor) {
      onSave(editor.getHTML() as T)
    } else if (type === 'list') {
      onSave(editValue)
    }
    setEditing(false)
  }

  const handleListChange = (index: number, newValue: string) => {
    if (type === 'list') {
      const newList = [...(editValue as string[])]
      newList[index] = newValue
      setEditValue(newList as T)
    }
  }

  const handleAddListItem = () => {
    if (type === 'list') {
      setEditValue([...(editValue as string[]), ''] as T)
    }
  }

  const handleRemoveListItem = (index: number) => {
    if (type === 'list') {
      const newList = (editValue as string[]).filter((_, i) => i !== index)
      setEditValue(newList as T)
    }
  }

  return (
    <Box mb="md">
      <Group justify="space-between" align="flex-end">
        <Title order={4}>{POLICY_FIELDS[field]?.label || field}</Title>
        {!editing && (
          <Button size="xs" variant="light" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </Group>
      {editing ? (
        <>
          {type === 'markdown' && editor && (
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          )}
          {type === 'list' && (
            <Stack gap="xs">
              {(editValue as string[]).map((item, index) => (
                <Group key={index} gap="xs" align="flex-start">
                  <TextInput
                    style={{ flex: 1 }}
                    value={item}
                    onChange={(e) => handleListChange(index, e.target.value)}
                    placeholder={`Enter ${POLICY_FIELDS[field]?.label.toLowerCase()} item`}
                  />
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => handleRemoveListItem(index)}
                    disabled={(editValue as string[]).length === 1}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={handleAddListItem}
                size="xs"
                style={{ alignSelf: 'flex-start' }}
              >
                Add Item
              </Button>
            </Stack>
          )}
          <Group mt="xs">
            <Button size="xs" color="mint" onClick={handleSave}>
              Save
            </Button>
            <Button size="xs" variant="default" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </Group>
        </>
      ) : type === 'markdown' ? (
        <Text size="md" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: value as string }} />
      ) : (
        <List>
          {(value as string[]).map((item, idx) => (
            <List.Item key={idx}>{item}</List.Item>
          ))}
        </List>
      )}
    </Box>
  )
}

interface PolicyDisplayProps {
  policies: Array<{
    policy: Policy
    type: PolicyType
    displayName: string
  }>
  defaultTab?: PolicyType
}

function PolicyContent({ policy, type }: { policy: Policy; type: PolicyType }) {
  const { updatePolicyField } = useForge()
  
  return (
    <Stack gap="md">
      <Title order={3}>{policy.name}</Title>
      {Object.entries(policy)
        .filter(([field]) => POLICY_FIELDS[field])
        .map(([field, value]) => {
          const fieldType = POLICY_FIELDS[field].type;
          if (fieldType === 'markdown') {
            return (
              <EditableField<string>
                key={field}
                which={type}
                field={field}
                value={String(value ?? '')}
                type={fieldType}
                onSave={(val) => updatePolicyField(type, field, val)}
              />
            )
          } else {
            return (
              <EditableField<string[]>
                key={field}
                which={type}
                field={field}
                value={value as string[]}
                type={fieldType}
                onSave={(val) => updatePolicyField(type, field, val)}
              />
            )
          }
        })}
    </Stack>
  )
}

export function PolicyDisplay({ policies, defaultTab }: PolicyDisplayProps) {
  if (!policies.length) return null

  // If there's only one policy, don't show tabs
  if (policies.length === 1) {
    return (
      <Paper p="xl" radius="md" withBorder shadow="sm">
        <PolicyContent policy={policies[0].policy} type={policies[0].type} />
      </Paper>
    )
  }

  return (
    <Paper p="xl" radius="md" withBorder shadow="sm">
      <Tabs defaultValue={defaultTab || policies[0].type}>
        <Tabs.List>
          {policies.map(({ type, displayName }) => (
            <Tabs.Tab key={type} value={type}>
              {displayName}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {policies.map(({ policy, type }) => (
          <Tabs.Panel key={type} value={type} pt="md">
            <PolicyContent policy={policy} type={type} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Paper>
  )
} 