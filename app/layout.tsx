import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Workflow Builder',
  description: 'Workflow Builder is a low-code platform that allows users to create and manage workflows visually.',
  generator: 'Workflow Builder',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
