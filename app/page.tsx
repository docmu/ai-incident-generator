'use client'

import { useState } from 'react'

type Severity = 'SEV-1' | 'SEV-2' | 'SEV-3'
type Status = 'Investigating' | 'Identified' | 'Mitigating' | 'Resolved'

type FormState = {
  severity: Severity
  status: Status
  affectedComponent: string
  customerImpact: string
  internalNotes: string
}

export default function Home() {
  const [form, setForm] = useState<FormState>({
    severity: 'SEV-2',
    status: 'Investigating',
    affectedComponent: '',
    customerImpact: '',
    internalNotes: '',
  })
  const [generatedUpdate, setGeneratedUpdate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishMessage, setPublishMessage] = useState('')

  const updateFormField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setPublishMessage('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to generate update')
      }

      const data = await response.json()
      setGeneratedUpdate(data.update)
    } catch (error: any) {
      console.error('Error generating update:', error)
      const errorMessage = error.message || 'Failed to generate update'
      setGeneratedUpdate(`Error: ${errorMessage}. ${errorMessage.includes('API key') ? '' : 'Please check your API key and try again.'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async () => {
    if (!generatedUpdate.trim()) {
      alert('Please generate an update first')
      return
    }

    setIsPublishing(true)
    setPublishMessage('')

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          update: generatedUpdate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to publish update')
      }

      const data = await response.json()
      setPublishMessage(`✓ Update published successfully (ID: ${data.id})`)
      setTimeout(() => setPublishMessage(''), 3000)
    } catch (error: any) {
      console.error('Error publishing update:', error)
      const errorMessage = error.message || 'Failed to publish update'
      setPublishMessage(`✗ ${errorMessage}`)
      setTimeout(() => setPublishMessage(''), 3000)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '28px', fontWeight: '600' }}>
        AI Incident Update Generator
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        minHeight: '600px'
      }}>
        {/* Left Column - Inputs */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
            Incident Details
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Severity
            </label>
            <select
              value={form.severity}
              onChange={(e) => updateFormField('severity', e.target.value as Severity)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="SEV-1">SEV-1</option>
              <option value="SEV-2">SEV-2</option>
              <option value="SEV-3">SEV-3</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Incident Status
            </label>
            <select
              value={form.status}
              onChange={(e) => updateFormField('status', e.target.value as Status)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="Investigating">Investigating</option>
              <option value="Identified">Identified</option>
              <option value="Mitigating">Mitigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Affected Component
            </label>
            <input
              type="text"
              value={form.affectedComponent}
              onChange={(e) => updateFormField('affectedComponent', e.target.value)}
              placeholder="e.g., Payment API, Database, CDN"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Customer Impact
            </label>
            <textarea
              value={form.customerImpact}
              onChange={(e) => updateFormField('customerImpact', e.target.value)}
              placeholder="Describe how customers are affected..."
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Internal Notes <span style={{ color: '#666', fontSize: '12px', fontWeight: 'normal' }}>(NOT customer-facing)</span>
            </label>
            <textarea
              value={form.internalNotes}
              onChange={(e) => updateFormField('internalNotes', e.target.value)}
              placeholder="Internal context, root cause details, etc."
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                backgroundColor: '#f9f9f9'
              }}
            />
          </div>
        </div>

        {/* Right Column - Output */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
            Customer-Facing Update
          </h2>

          <textarea
            value={generatedUpdate}
            onChange={(e) => setGeneratedUpdate(e.target.value)}
            placeholder="Generated update will appear here..."
            rows={12}
            style={{
              width: '100%',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              flex: 1,
              marginBottom: '20px'
            }}
          />

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || isPublishing}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isGenerating || isPublishing ? 'not-allowed' : 'pointer',
                opacity: isGenerating || isPublishing ? 0.6 : 1
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Update'}
            </button>

            <button
              onClick={handlePublish}
              disabled={!generatedUpdate.trim() || isPublishing || isGenerating}
              style={{
                padding: '10px 20px',
                backgroundColor: '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: (!generatedUpdate.trim() || isPublishing || isGenerating) ? 'not-allowed' : 'pointer',
                opacity: (!generatedUpdate.trim() || isPublishing || isGenerating) ? 0.6 : 1
              }}
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>

          {publishMessage && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {publishMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
