import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Incident Update Generator',
  description: 'Generate customer-facing incident communications',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
