import React, { createContext, useContext, useState } from 'react'
import { apiFetch } from '../api'

export interface Policy {
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

interface ForgeContextType {
  step: number
  setStep: (step: number) => void
  machinePolicy: Policy | null
  setMachinePolicy: (p: Policy | null) => void
  publicPolicy: Policy | null
  setPublicPolicy: (p: Policy | null) => void
  moderatorPolicy: Policy | null
  setModeratorPolicy: (p: Policy | null) => void
  examples: any[] | null
  setExamples: (e: any[] | null) => void
  reviewedExamples: any[] | null
  setReviewedExamples: (e: any[] | null) => void
  isLoading: boolean
  setIsLoading: (b: boolean) => void
  error: string | null
  setError: (e: string | null) => void
  refineError: string | null
  setRefineError: (e: string | null) => void
  submitIntent: (data: any) => Promise<void>
  generateExamples: () => Promise<void>
  refineMachinePolicy: () => Promise<void>
  generateDerivedPolicies: () => Promise<void>
  updatePolicyField: (
    which: 'machine' | 'public' | 'moderator',
    field: string,
    value: string | string[]
  ) => void
  nextStep: () => void
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined)

export function ForgeProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0)
  const [machinePolicy, setMachinePolicy] = useState<Policy | null>(null)
  const [publicPolicy, setPublicPolicy] = useState<Policy | null>(null)
  const [moderatorPolicy, setModeratorPolicy] = useState<Policy | null>(null)
  const [examples, setExamples] = useState<any[] | null>(null)
  const [reviewedExamples, setReviewedExamples] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refineError, setRefineError] = useState<string | null>(null)

  const submitIntent = async (data: any) => {
    setIsLoading(true)
    setError(null)
    try {
      const intentResponse = await apiFetch('/api/intent/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!intentResponse.ok) throw new Error('Failed to submit intent')
      const enrichedIntent = await intentResponse.json()
      const policyResponse = await apiFetch('/api/policy/generate/initial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: enrichedIntent.intent }),
      })
      if (!policyResponse.ok) throw new Error('Failed to generate machine policy')
      const policyData = await policyResponse.json()
      setMachinePolicy(policyData.machine)
      nextStep()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const generateExamples = async () => {
    if (!machinePolicy) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/examples/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: machinePolicy }),
      })
      if (!response.ok) throw new Error('Failed to generate examples')
      const data = await response.json()
      setExamples(data.examples)
      setReviewedExamples(data.examples)
      nextStep()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const refineMachinePolicy = async () => {
    if (!machinePolicy || !reviewedExamples) return
    setIsLoading(true)
    setRefineError(null)
    try {
      const response = await apiFetch('/api/policy/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machine: machinePolicy, reviewed_examples: reviewedExamples }),
      })
      if (!response.ok) throw new Error('Failed to refine machine policy')
      const data = await response.json()
      setMachinePolicy(data.machine)
      nextStep()
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const generateDerivedPolicies = async () => {
    if (!machinePolicy) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/policy/generate/derived', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ machine: machinePolicy }),
      })
      if (!response.ok) throw new Error('Failed to generate derived policies')
      const data = await response.json()
      setPublicPolicy(data.public)
      setModeratorPolicy(data.moderator)
      nextStep()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const updatePolicyField = (
    which: 'machine' | 'public' | 'moderator',
    field: string,
    value: string | string[]
  ) => {
    if (which === 'machine' && machinePolicy) {
      setMachinePolicy({
        ...machinePolicy,
        [field]: value,
      })
    } else if (which === 'public' && publicPolicy) {
      setPublicPolicy({
        ...publicPolicy,
        [field]: value,
      })
    } else if (which === 'moderator' && moderatorPolicy) {
      setModeratorPolicy({
        ...moderatorPolicy,
        [field]: value,
      })
    }
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  return (
    <ForgeContext.Provider value={{
      step, setStep,
      machinePolicy, setMachinePolicy,
      publicPolicy, setPublicPolicy,
      moderatorPolicy, setModeratorPolicy,
      examples, setExamples,
      reviewedExamples, setReviewedExamples,
      isLoading, setIsLoading,
      error, setError,
      refineError, setRefineError,
      submitIntent,
      generateExamples,
      refineMachinePolicy,
      generateDerivedPolicies,
      updatePolicyField,
      nextStep
    }}>
      {children}
    </ForgeContext.Provider>
  )
}

export function useForge() {
  const ctx = useContext(ForgeContext)
  if (!ctx) throw new Error('useForge must be used within a ForgeProvider')
  return ctx
} 