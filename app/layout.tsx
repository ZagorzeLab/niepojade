import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

// Fonty Google
const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rozkład Jazdy • Niepołomice",
  description:
    "Rozkład jazdy autobusów gminnych w Niepołomicach – linie T1–T5",

  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "Niepojade.pl – transport intersołecki",
    description: "Rozkłady linii T1–T5 w Niepołomicach",
    url: "https://www.niepojade.pl",
    siteName: "Niepojade.pl",
    type: "website",
    images: [
      {
        url: "https://www.niepojade.pl/images/niepolomice-logo-fb.png",
        width: 1200,
        height: 630,
        alt: "Niepojade.pl – transport w Niepołomicach",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Niepojade.pl – transport intersołecki",
    description: "Rozkłady linii T1–T5 w Niepołomicach",
    images: [
      "https://www.niepojade.pl/images/niepolomice-logo-fb.png",
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        {/* GoatCounter – prywatny licznik wejść */}
        <Script
          data-goatcounter="https://niepojade.goatcounter.com/count"
          async
          src="https://gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
