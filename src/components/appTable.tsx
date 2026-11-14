'use client'
import type { Application, Status } from "@/lib/db/schema";
import { useOptimistic, useTransition } from "react";
import { updateStatus, deleteApplication } from "@/app/actions";
import EditApplicationDialog from "./EditApplicationDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MotionRow = motion.create(TableRow)

type Props = { applications: Application[] }

const STATUSES: Status[] = [
  "Applied",
  "1st Interview",
  "2nd Interview",
  "3rd Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Dormant",
  "Ghosted",
]

const statusStyles: Record<Status, string> = {
  Applied: "bg-[#c2fbfb]/[0.06] text-[#c3c9cb] ring-white/10",
  "1st Interview": "bg-[#02eff0]/10 text-[#84f6f7] ring-[#02eff0]/25",
  "2nd Interview": "bg-[#02eff0]/15 text-[#45f3f4] ring-[#02eff0]/35",
  "3rd Interview": "bg-[#02eff0]/20 text-[#02eff0] ring-[#02eff0]/50 shadow-[0_0_14px_-4px_rgba(2,239,240,0.7)]",
  Offer: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/40 shadow-[0_0_16px_-4px_rgba(52,211,153,0.7)]",
  Rejected: "bg-rose-500/10 text-rose-300 ring-rose-400/25",
  Withdrawn: "bg-white/5 text-[#85949a] ring-white/10",
  Dormant: "bg-amber-400/10 text-amber-200 ring-amber-300/25",
  Ghosted: "bg-white/[0.03] text-[#4a5e64] ring-white/5",
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <motion.span
      key={status}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {status}
    </motion.span>
  )
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
})

const formatDate = (date: Date) => dateFmt.format(date)

type StatusUpdate = { id: number; status: Status; at: Date }


export default function AppTable({ applications }: Props) {
  const reduce = useReducedMotion()
  const [optimisticApps, addOptimistic] = useOptimistic(
    applications,
    (current: Application[], { id, status, at }: StatusUpdate) =>
      current.map((app) =>
        app.id === id ? { ...app, status, lastActivityAt: at } : app
      )
  )
  const [isPending, startTransition] = useTransition()

  // Optimistic updates have to be dispatched inside a transition. React shows
  // the new status right away, keeps the transition pending until the action
  // settles, then swaps in the server revalidated data (or rolls back).
  function handleStatusChange(id: number, status: Status) {
    startTransition(async () => {
      addOptimistic({ id, status, at: new Date() })
      await updateStatus(id, status)
    })
  }

  function handleDeleteApplication(id: number) {
  if (confirm("Are you sure you want to delete this application?")) {
    deleteApplication(id)
  }
}



  return (
    <div className="glass overflow-hidden rounded-2xl p-2">
    <Table>
      <TableCaption className="mb-2">A list of your job applications.</TableCaption>
      <TableHeader className="[&_th]:h-11 [&_th]:px-4 [&_th]:text-[11px] [&_th]:font-medium [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-[#85949a]">
        <TableRow className="hover:bg-transparent">
          <TableHead>Company</TableHead>
          <TableHead>Job Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Links</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className={`[&_td]:px-4 [&_td]:py-3 ${isPending ? "opacity-60 transition-opacity" : "transition-opacity"}`}>
        {optimisticApps.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={8} className="py-16! text-center text-muted-foreground">
              No applications yet.
            </TableCell>
          </TableRow>
        ) : (
          <AnimatePresence initial={!reduce}>
          {optimisticApps.map((app, i) => (
            <MotionRow
              key={app.id}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: reduce ? 0 : -12 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
              className="border-white/5 hover:bg-[#02eff0]/[0.04]"
            >
              <TableCell className="font-medium text-white">{app.companyName}</TableCell>
              <TableCell className="text-[#c3c9cb]">{app.jobTitle}</TableCell>
            
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#02eff0]/60">
                    <StatusBadge status={app.status} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border border-white/10 bg-[#0f282f]/90 backdrop-blur-xl">
                    {STATUSES.map(s => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => handleStatusChange(app.id, s)}
                      >
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              <TableCell className="text-[#85949a] tabular-nums">{formatDate(app.appliedAt)}</TableCell>
              <TableCell className="text-[#85949a] tabular-nums">{formatDate(app.lastActivityAt)}</TableCell>
              <TableCell>
                <div className="flex gap-3">
                  {app.jobUrl && (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#45f3f4] underline decoration-[#02eff0]/30 underline-offset-4 transition-colors hover:text-[#84f6f7] hover:decoration-[#02eff0]"
                    >
                      Job
                    </a>
                  )}
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#45f3f4] underline decoration-[#02eff0]/30 underline-offset-4 transition-colors hover:text-[#84f6f7] hover:decoration-[#02eff0]"
                    >
                      Resume
                    </a>
                  )}
                  {!app.jobUrl && !app.resumeUrl && (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell title={app.notes ?? undefined}>
                <span className="block max-w-[200px] truncate text-[#85949a]">
                  {app.notes || "—"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                <EditApplicationDialog application={app} />

                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-rose-500/10 hover:text-rose-300"
                  onClick={() => handleDeleteApplication(app.id)}
                >
                  Delete
                </Button>
                </div>
              </TableCell>
            </MotionRow>
          ))}
          </AnimatePresence>
        )}
      </TableBody>
      <TableFooter className="border-white/5 bg-transparent">
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={8} className="px-4 py-3 text-xs font-normal text-[#85949a]">
            {optimisticApps.length} application{optimisticApps.length === 1 ? "" : "s"}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    </div>
  )
}
