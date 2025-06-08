import { useState } from 'react'
import { Paper, Title, Text, Tabs, Stack, List, Button, Group, Box, TextInput, ActionIcon } from '@mantine/core'
import { useForge } from './ForgeContext'
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

function EditableField<T extends string | string[]>({
  which,
  field,
  value,
  type,
  onSave,
}: {
  which: 'public' | 'moderator' | 'machine'
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

export function PolicyDisplay() {
  const { policies, refinedPolicies, updatePolicyField } = useForge()
  if (!policies && !refinedPolicies) return null
  const current = refinedPolicies || policies
  const tabs: Array<{ key: 'public' | 'moderator' | 'machine'; label: string }> = [
    { key: 'public', label: 'Public Policy' },
    { key: 'moderator', label: 'Moderator Policy' },
    { key: 'machine', label: 'Machine Policy' },
  ]
  return (
    <Paper p="xl" radius="md" withBorder shadow="sm">
      <Tabs defaultValue="public">
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.key} value={tab.key}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>
        <Stack gap="md" mt="md">
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.key} value={tab.key}>
              <Stack gap="md">
                <Title order={3}>{String(current[tab.key].name)}</Title>
                {Object.entries(current[tab.key])
                  .filter(([field]) => POLICY_FIELDS[field])
                  .map(([field, value]) => {
                    const type = POLICY_FIELDS[field].type;
                    if (type === 'markdown') {
                      return (
                        <EditableField<string>
                          key={field}
                          which={tab.key}
                          field={field}
                          value={String(value ?? '')}
                          type={type}
                          onSave={(val) => updatePolicyField(tab.key, field, val)}
                        />
                      );
                    } else {
                      return (
                        <EditableField<string[]>
                          key={field}
                          which={tab.key}
                          field={field}
                          value={Array.isArray(value) ? (value as string[]) : []}
                          type={type}
                          onSave={(val: string[]) => updatePolicyField(tab.key, field, val)}
                        />
                      );
                    }
                  })}
              </Stack>
            </Tabs.Panel>
          ))}
        </Stack>
      </Tabs>
    </Paper>
  )
} 