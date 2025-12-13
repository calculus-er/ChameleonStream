import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ChaosToggle from '@/components/ChaosToggle'
import ChaosManager from '@/components/ChaosManager'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Chameleon Stream - AI Localization Platform',
  description: 'Flawless lip-sync, translated audio, and dynamic visual context swap for global content.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ChaosManager />
        {children}
        <ChaosToggle />
      </body>
    </html>
  )
}

