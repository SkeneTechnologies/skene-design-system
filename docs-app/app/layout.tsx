import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Skene design system',
  description: 'One package, two surfaces.',
}

/**
 * The package declares a font contract and nothing more: it expects
 * `--font-geist-sans` and `--font-geist-mono` to exist, and maps them in
 * @theme inline. next/font is a Next-only build-time API that has to be called
 * from the consumer's own layout, so wiring it is the app's job. Both real apps
 * already satisfy this, which is why adopting the package needs no font work.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
