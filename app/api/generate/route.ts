import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { severity, status, affectedComponent, customerImpact, internalNotes } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY environment variable is not set' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const systemPrompt = `You are a technical writer specializing in customer-facing incident communications. Your task is to generate clear, professional, and reassuring status page updates.

CRITICAL RULES:
1. NEVER include internal details, root cause speculation, technical jargon, or blame
2. NEVER include or reference internal notes verbatim - they are context only
3. Focus on customer impact and current status in plain language
4. Use a neutral, professional, and calm tone
5. Keep the update to 3-5 sentences maximum
6. Be specific about what customers are experiencing, not technical details
7. Avoid speculation about causes or timelines unless certain
8. Use active voice and clear, simple language`

    const userPrompt = `Generate a customer-facing incident status update with the following information:

Severity: ${severity}
Current Status: ${status}
Affected Component: ${affectedComponent || 'Not specified'}
Customer Impact: ${customerImpact || 'Not specified'}

${internalNotes ? `Internal Context (DO NOT include in output, use only for understanding): ${internalNotes}` : ''}

Generate a succinct, professional status update that:
- Clearly describes what customers are experiencing
- States the current status (${status})
- Uses appropriate tone for ${severity} severity
- Avoids any internal details or technical specifics
- Is ready to publish on a status page`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    })

    const update = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ update })
  } catch (error: any) {
    console.error('Error calling Claude API:', error)
    
    let errorMessage = 'Failed to generate update'
    
    if (error.error?.message) {
      errorMessage = error.error.message
    } else if (error.status === 401 || error.message?.includes('authentication') || error.message?.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your ANTHROPIC_API_KEY environment variable.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
