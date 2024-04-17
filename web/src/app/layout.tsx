import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import "./globals.css";
import Header from './layout/header';

export const metadata: Metadata = {
  title: "EVE Hangar",
  description: "EVE Online Public Hangar",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png'
      },
      {
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png'
      }
    ]
  }
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <Header />
        <hr />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
      {/* <GoogleAnalytics gaId="{ process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID }" /> */}
    </html>
  );
}

export default RootLayout;
