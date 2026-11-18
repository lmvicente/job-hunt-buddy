import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { ArrowRight, Lock, MousePointerClick, Rows3 } from "lucide-react"
import type { Status } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion"
import { statusStyles } from "@/components/statusStyles"
import Logo from "@/components/logo"

// Sample rows for the product preview only.
const PREVIEW: { company: string; role: string; status: Status; applied: string; last: string }[] = [
  { company: "Acme Corp", role: "Software Engineer", status: "Offer", applied: "Oct 2", last: "Nov 14" },
  { company: "Northwind", role: ".NET Developer", status: "Interview", applied: "Oct 20", last: "Nov 12" },
  { company: "Globex", role: "Full Stack Developer", status: "Screening", applied: "Nov 3", last: "Nov 10" },
  { company: "Initech", role: "Backend Engineer", status: "Applied", applied: "Nov 10", last: "Nov 10" },
  { company: "Umbrella", role: "Frontend Developer", status: "Dormant", applied: "Sep 28", last: "Oct 9" },
]

const FEATURES = [
  {
    icon: Rows3,
    title: "Everything in one row",
    body: "Company, role, date applied, the job posting, your resume and notes, side by side.",
  },
  {
    icon: MousePointerClick,
    title: "Status in one click",
    body: "Move an application from Applied to Interview to Offer without opening a form.",
  },
  {
    icon: Lock,
    title: "Only you see it",
    body: "Sign in with your own account. Your applications are tied to you and no one else.",
  },
]

export default function Landing() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-[1160px] px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-24">
        <FadeIn>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-[13px] text-muted-foreground shadow-(--shadow-panel)">
            A more organized job search
          </span>
          <h1 className="mx-auto mt-6 max-w-[14ch] text-[40px] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[60px]">
            Every application, in one place.
          </h1>
          <p className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-relaxed text-muted-foreground">
            Log each job you apply to, track where it stands, and see at a glance what needs a follow-up.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <SignUpButton>
              <Button size="lg" className="h-11 px-6 text-[15px]">
                Get started
                <ArrowRight aria-hidden="true" />
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="lg" variant="outline" className="h-11 px-6 text-[15px]">
                Log in
              </Button>
            </SignInButton>
          </div>
        </FadeIn>
      </section>

      {/* Product preview */}
      <section className="mx-auto max-w-[1000px] px-5 sm:px-8" aria-label="Example of the tracker">
        <FadeIn delay={0.06}>
          <div className="relative overflow-hidden rounded-[22px] bg-card/60 p-2 shadow-(--shadow-panel)">
            <div className="rounded-[14px] bg-card p-5 shadow-[0_0_0_1px_var(--border)] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[17px] font-semibold tracking-[-0.01em]">Applications</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">5 applications</p>
                </div>
                <span className="hidden h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-(--shadow-button) sm:inline-flex" aria-hidden="true">
                  Add application
                </span>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="text-[13px] text-muted-foreground">
                      <th className="border-b border-border px-3 pb-3 font-normal">Company</th>
                      <th className="border-b border-border px-3 pb-3 font-normal">Status</th>
                      <th className="border-b border-border px-3 pb-3 font-normal">Applied</th>
                      <th className="border-b border-border px-3 pb-3 font-normal">Last activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PREVIEW.map((r) => (
                      <tr key={r.company} className="border-b border-border last:border-0">
                        <td className="px-3 py-3.5">
                          <div className="font-medium">{r.company}</div>
                          <div className="mt-0.5 text-[13px] text-muted-foreground">{r.role}</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={`inline-flex items-center gap-2 ${statusStyles[r.status]}`}>
                            <span className="size-[7px] rounded-full bg-current ring-3 ring-current/15" aria-hidden="true" />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-(--text-2) tabular-nums">{r.applied}</td>
                        <td className="px-3 py-3.5 text-(--text-2) tabular-nums">{r.last}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Soft fade at the bottom edge */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background/80 to-transparent" aria-hidden="true" />
          </div>
        </FadeIn>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1000px] px-5 py-20 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <span className="grid size-9 place-items-center rounded-[10px] bg-(--accent-soft) text-(--accent-text)">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[15px] font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-[1000px] px-5 pb-20 pt-10 sm:px-8">
        <div className="flex flex-col items-center gap-5 rounded-[22px] bg-card px-6 py-12 text-center shadow-(--shadow-panel)">
          <h2 className="text-[26px] font-semibold tracking-[-0.025em]">Start tracking your applications</h2>
          <p className="max-w-[42ch] text-muted-foreground">Create an account and log your first application.</p>
          <SignUpButton>
            <Button size="lg" className="h-11 px-6 text-[15px]">
              Create your account
            </Button>
          </SignUpButton>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1160px] items-center justify-between gap-4 border-t border-border px-5 py-8 text-[13px] text-muted-foreground sm:px-8">
        <Logo />
        <span>© {new Date().getFullYear()} Job Hunt Buddy</span>
      </footer>
    </main>
  )
}
