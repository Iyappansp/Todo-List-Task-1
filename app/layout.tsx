import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ThemeProvider from "@/components/theme-provider"
import LoaderOverlay from "@/components/loader-overlay"
import { Suspense } from "react"

// Font loader must be called at module scope
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  title: "Iyaps-Todo",
  description: "Iyaps",
  generator: "iyapps",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans transition-colors duration-300`}>
        {/* Animated gradient background */}
        <div className="animated-gradient pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider>{children}</ThemeProvider>
        </Suspense>
        <LoaderOverlay />
        <Analytics />
      </body>
    </html>
  )
}
