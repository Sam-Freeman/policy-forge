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
  policies: { public: Policy; moderator: Policy; machine: Policy } | null
  setPolicies: (p: any) => void
  examples: any[] | null
  setExamples: (e: any[] | null) => void
  reviewedExamples: any[] | null
  setReviewedExamples: (e: any[] | null) => void
  refinedPolicies: any | null
  setRefinedPolicies: (p: any) => void
  isLoading: boolean
  setIsLoading: (b: boolean) => void
  error: string | null
  setError: (e: string | null) => void
  refineLoading: boolean
  setRefineLoading: (b: boolean) => void
  refineError: string | null
  setRefineError: (e: string | null) => void
  submitIntent: (data: any) => Promise<void>
  generateExamples: () => Promise<void>
  refinePoliciesAction: () => Promise<void>
}

const ForgeContext = createContext<ForgeContextType | undefined>(undefined)

export function ForgeProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0)
  const [policies, setPolicies] = useState<any>(null)
  const [examples, setExamples] = useState<any[] | null>(null)
  const [reviewedExamples, setReviewedExamples] = useState<any[] | null>(null)
  const [refinedPolicies, setRefinedPolicies] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refineLoading, setRefineLoading] = useState(false)
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
      const policyResponse = await apiFetch('/api/policy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: enrichedIntent.intent }),
      })
      if (!policyResponse.ok) throw new Error('Failed to generate policies')
      const policyData = await policyResponse.json()
      setPolicies(policyData)
      setStep(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const generateExamples = async () => {
    if (!policies) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiFetch('/api/examples/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: policies.machine }),
      })
      if (!response.ok) throw new Error('Failed to generate examples')
      const data = await response.json()
      setExamples(data.examples)
      setReviewedExamples(data.examples)
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const refinePoliciesAction = async () => {
    if (!policies || !reviewedExamples) return
    setRefineLoading(true)
    setRefineError(null)
    setStep(3)
    try {
      const response = await apiFetch('/api/policy/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public: policies.public, moderator: policies.moderator, machine: policies.machine, examples: reviewedExamples }),
      })
      if (!response.ok) throw new Error('Failed to refine policies')
      const data = await response.json()
      setRefinedPolicies(data)
    } catch (err) {
      setRefineError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setRefineLoading(false)
    }
  }

  return (
    <ForgeContext.Provider value={{
      step, setStep, policies, setPolicies, examples, setExamples, reviewedExamples, setReviewedExamples, refinedPolicies, setRefinedPolicies,
      isLoading, setIsLoading, error, setError, refineLoading, setRefineLoading, refineError, setRefineError,
      submitIntent, generateExamples, refinePoliciesAction
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