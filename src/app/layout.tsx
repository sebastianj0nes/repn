import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthWrapper from '@/components/AuthWrapper'
import { Analytics } from "@vercel/analytics/react"
import Providers from '@/components/Providers'
import { Toaster } from "@/components/ui/toaster"
import { TipProvider } from '@/context/TipContext'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Repn - Free Gym Application & Workout Tracker',
  description: 'Start tracking your fitness the right way. Our extensive web application allows users to gain key insights into their workouts and fitness habits. Try our app today! It is free!!',
  keywords: ['gym', 'fitness', 'workout tracker', 'exercise', 'free', 'free gym app', 'gym app', 'free exercise tracker', 'free workout tracker', 'exercise tracker', 'gym tracker'],
  authors: [{ name: 'Sebastian Jones' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <TipProvider>
            <AuthWrapper>
              <main>{children}</main>
            </AuthWrapper>
          </TipProvider>
        </Providers>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
