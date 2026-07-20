import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import './globals.css'
import Header from './layout/header'
import { SupabaseContextProvider } from '@/context/SupabaseContext'

// The root layout renders <Header/>, which reads the auth cookie via
// createClient() on every request, so nothing beneath this layout can be
// statically prerendered. Marking the layout dynamic keeps `next build` from
// attempting to statically generate framework pages like /_not-found and
// /error — that attempt instantiates a Supabase client at build time and, when
// the Supabase env vars aren't inlined into the build, crashes the whole build.
export const dynamic = 'force-dynamic'

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
        <head>
          <link rel="service" type="application/mcp+json" href="/.well-known/mcp.json" />
          <link rel="service-desc" href="/openapi.json" />
        </head>
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
