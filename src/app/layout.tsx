import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import Link from 'next/link'
import { Suspense } from 'react'
import './globals.css'
import { ui } from '@clerk/ui'
import { shadcn } from '@clerk/ui/themes'
import { currentUser } from "@clerk/nextjs/server"
import Welcome from "@/components/welcome";
import Logo from "@/components/logo";
import { MotionProvider } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Job Hunt Buddy',
  description: 'Track every job application in one place: where you applied, what stage you are at, and what needs a follow-up.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const user = await currentUser();

  const firstName = user?.firstName ?? "";

  return (
    <html lang="en" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body className="glow-bg min-h-full flex flex-col">
        <ClerkProvider ui={ui} appearance={{ theme: shadcn }}>
          <MotionProvider>
            <header className="mx-auto flex h-16 w-full max-w-[1160px] items-center justify-between gap-4 px-5 sm:px-8">
              <Link href="/" className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
                <Logo />
              </Link>
              <div className="flex items-center gap-2">
                <Suspense>
                  <Show when="signed-out">
                    <SignInButton>
                      <Button variant="ghost">Log in</Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button>Sign up</Button>
                    </SignUpButton>
                  </Show>
                  <Show when="signed-in">
                    <div className="flex items-center gap-3">
                      <Welcome firstName={firstName}></Welcome>
                      <UserButton />
                    </div>
                  </Show>
                </Suspense>
              </div>
            </header>
            {children}
          </MotionProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
