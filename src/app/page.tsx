import { Show, RedirectToSignIn } from "@clerk/nextjs";
import AppTable from "@/components/appTable";
import AddApplicationDialog from "@/components/AddApplicationDialog";
import { FadeIn } from "@/components/motion";
import { getJobApplicationsForUser } from "@/lib/db/queries";

export default async function Home() {
  const applications = await getJobApplicationsForUser();

  return (
    <>
    <Show when="signed-out">
      <RedirectToSignIn />
    </Show>
    <Show when="signed-in">
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-14">
        <FadeIn>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#c3c9cb] backdrop-blur">
            <span className="size-1.5 rounded-full bg-[#02eff0] shadow-[0_0_8px_#02eff0]" />
            Application tracker
          </span>
        </FadeIn>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <FadeIn delay={0.06}>
              <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-tight text-brand-gradient sm:text-6xl">
                Every application,
                <br />
                in one place.
              </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="mt-4 max-w-md text-[#85949a]">
                Track where you applied, what stage you&apos;re at, and what needs a follow-up.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.18}>
            <AddApplicationDialog />
          </FadeIn>
        </div>

        <FadeIn delay={0.26} className="mt-12">
          <AppTable applications={applications}></AppTable>
        </FadeIn>
      </main>
    </Show>
    </>
  )
}
