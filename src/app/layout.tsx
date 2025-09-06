import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import Navigation from '@/components/layout/navigation'

export const metadata: Metadata = {
  title: 'Smart Travel Planner',
  description: 'AI-powered travel planning app for budget-conscious travelers',
  keywords: 'travel, planning, budget, AI, itinerary, vacation',
  authors: [{ name: 'Smart Travel Planner Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 font-inter antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))'
                },
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}