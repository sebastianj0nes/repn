import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import AuthWrapper from '@/components/AuthWrapper'
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'sonner';

import '@/app/globals.css'
import BottomNav from '@/components/BottomNav'

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
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthWrapper>
            <main>{children}</main>
            <Toaster />
          </AuthWrapper>
        </ThemeProvider>
        <Analytics/>
      </body>
    </html>
  )
}
