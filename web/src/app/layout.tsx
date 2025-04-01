import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import './globals.css'
import Header from './layout/header'
import { SupabaseContextProvider } from '@/context/SupabaseContext'
export const metadata: Metadata = {
  title: 'Kennerspiel',
  description: 'Digital Tabletop',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
    ],
  },
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SupabaseContextProvider>
      <html lang="en">
        <body>
          <Header />
          <hr />
          {children}
          <Analytics />
          <SpeedInsights />
          <hr />
        </body>
      </html>
    </SupabaseContextProvider>
  )
}

export default RootLayout
