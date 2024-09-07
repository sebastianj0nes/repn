import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import AuthWrapper from '@/components/AuthWrapper'

import '@/app/globals.css'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

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
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}