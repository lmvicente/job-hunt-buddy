import { Show } from "@clerk/nextjs";
import AppTable from "@/components/appTable";
import AddApplicationDialog from "@/components/AddApplicationDialog";
import Landing from "@/components/Landing";
import { FadeIn } from "@/components/motion";
import { getJobApplicationsForUser } from "@/lib/db/queries";

export default async function Home() {
  const applications = await getJobApplicationsForUser();

  // Summary strip numbers
  const total = applications.length
  const interviewing = applications.filter(a => a.status === "Screening" || a.status === "Interview").length
  const offers = applications.filter(a => a.status === "Offer").length

  return (
    <>
    <Show when="signed-out">
      <Landing />
    </Show>
    <Show when="signed-in">
      <main className="mx-auto w-full max-w-[1160px] flex-1 px-3 pt-2 pb-16 sm:px-8">
        <FadeIn className="rounded-[18px] bg-card px-5 pt-7 pb-5 shadow-(--shadow-panel) sm:px-8 sm:pt-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-[26px] leading-tight font-semibold tracking-[-0.025em] sm:text-[30px]">Applications</h1>
              <p className="mt-2 text-sm text-muted-foreground">Track where you applied and what needs a follow-up.</p>
            </div>
            <AddApplicationDialog />
          </div>

          <dl className="mt-7 grid grid-cols-3 border-y border-border">
            <div className="py-4 pr-4">
              <dt className="text-[13px] text-muted-foreground">Total</dt>
              <dd className="mt-1 text-[24px] font-semibold tracking-[-0.02em] tabular-nums">{total}</dd>
            </div>
            <div className="border-l border-border px-4 py-4 sm:px-6">
              <dt className="text-[13px] text-muted-foreground">In interviews</dt>
              <dd className="mt-1 text-[24px] font-semibold tracking-[-0.02em] tabular-nums">{interviewing}</dd>
            </div>
            <div className="border-l border-border px-4 py-4 sm:px-6">
              <dt className="text-[13px] text-muted-foreground">Offers</dt>
              <dd className="mt-1 text-[24px] font-semibold tracking-[-0.02em] text-(--accent-text) tabular-nums">{offers}</dd>
            </div>
          </dl>

          <div className="mt-2">
            <AppTable applications={applications}></AppTable>
          </div>
        </FadeIn>
      </main>
    </Show>
    </>
  )
}
