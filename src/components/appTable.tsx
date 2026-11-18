'use client'
import type { Application, Status } from "@/lib/db/schema";
import { useOptimistic } from "react";
import { updateStatus } from "@/app/actions";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
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
import { statusStyles } from "@/components/statusStyles";
import { easeIn, easeOut } from "@/components/motion";

type Props = { applications: Application[] }

const STATUSES: Status[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Dormant",
  "Ghosted",
]

const MotionRow = motion.create(TableRow)

// Rows: fade + tiny rise on first load, ≤30ms stagger; exits fade out with ease-in.
const rowMotion = (index: number) => ({
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: easeOut, delay: Math.min(index * 0.03, 0.24) } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: easeIn } },
})

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${statusStyles[status]}`}>
      {/* Keyed on status so a change settles in with a quick spring */}
      <motion.span
        key={status}
        initial={{ scale: 0.6, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
        className="size-[7px] rounded-full bg-current ring-3 ring-current/15"
        aria-hidden="true"
      />
      {status}
      <ChevronDown className="size-3 text-(--text-4)" aria-hidden="true" />
    </span>
  )
}

function StatusMenu({ app }: { app: Application }) {
  return (
    <DropdownMenu>
      {/* Bigger hit area than it looks (Fitts) */}
      <DropdownMenuTrigger className="-mx-2 -my-1 inline-flex h-9 cursor-pointer items-center rounded-lg px-2 outline-none transition-colors duration-150 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 data-popup-open:bg-muted">
        <StatusBadge status={app.status} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        {STATUSES.map(s => (
          <DropdownMenuItem key={s} onClick={() => updateStatus(app.id, s)}>
            <span className={`flex items-center gap-2 ${statusStyles[s]}`}>
              <span className="size-[7px] rounded-full bg-current" aria-hidden="true" />
              {s}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Links({ app }: { app: Application }) {
  const link = "text-(--accent-text) underline decoration-current/35 underline-offset-[3px] transition-colors duration-150 hover:decoration-current"
  return (
    <div className="flex gap-3">
      {app.jobUrl && (
        <a href={app.jobUrl} target="_blank" rel="noreferrer" className={link}>
          Job
        </a>
      )}
      {app.resumeUrl && (
        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className={link}>
          Resume
        </a>
      )}
      {!app.jobUrl && !app.resumeUrl && (
        <span className="text-(--text-4)">—</span>
      )}
    </div>
  )
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
})

const formatDate = (date: Date) => dateFmt.format(date)

export default function AppTable({ applications }: Props) {
  const [optimisticApps, addOptimistic] = useOptimistic(applications)
  //optimisticApps.map(...)

  if (applications.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium">Add your first application</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Every job you log shows up here, with its status, dates and links.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop and tablet: table */}
      <div className="-mx-4 hidden md:block">
        <Table className="text-sm">
          <TableHeader className="[&_tr]:border-border">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12 px-4 font-normal text-muted-foreground">Company</TableHead>
              <TableHead className="h-12 px-4 font-normal text-muted-foreground">Status</TableHead>
              <TableHead className="h-12 px-4 font-normal text-muted-foreground">Applied</TableHead>
              <TableHead className="h-12 px-4 font-normal text-muted-foreground">Last activity</TableHead>
              <TableHead className="h-12 px-4 font-normal text-muted-foreground">Links</TableHead>
              <TableHead className="h-12 px-4 font-normal text-muted-foreground">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial>
              {applications.map((app, i) => (
                <MotionRow
                  key={app.id}
                  {...rowMotion(i)}
                  className="border-border transition-colors duration-[120ms] hover:bg-(--row-hover)"
                >
                  <TableCell className="px-4 py-4">
                    <div className="font-medium">{app.companyName}</div>
                    <div className="mt-0.5 text-[13px] text-muted-foreground">{app.jobTitle}</div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <StatusMenu app={app} />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-(--text-2) tabular-nums">{formatDate(app.appliedAt)}</TableCell>
                  <TableCell className="px-4 py-4 text-(--text-2) tabular-nums">{formatDate(app.lastActivityAt)}</TableCell>
                  <TableCell className="px-4 py-4">
                    <Links app={app} />
                  </TableCell>
                  <TableCell className="px-4 py-4 text-muted-foreground" title={app.notes ?? undefined}>
                    <span className="block max-w-[220px] truncate">
                      {app.notes || "—"}
                    </span>
                  </TableCell>
                </MotionRow>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Phone: one block per application, label/value rows */}
      <ul className="md:hidden">
        <AnimatePresence initial>
          {applications.map((app, i) => (
            <motion.li key={app.id} {...rowMotion(i)} className="border-b border-border py-4 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{app.companyName}</p>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{app.jobTitle}</p>
                </div>
                <StatusMenu app={app} />
              </div>
              <dl className="mt-3 grid grid-cols-[110px_1fr] gap-y-2 text-[13px]">
                <dt className="text-muted-foreground">Applied</dt>
                <dd className="text-(--text-2) tabular-nums">{formatDate(app.appliedAt)}</dd>
                <dt className="text-muted-foreground">Last activity</dt>
                <dd className="text-(--text-2) tabular-nums">{formatDate(app.lastActivityAt)}</dd>
                <dt className="text-muted-foreground">Links</dt>
                <dd><Links app={app} /></dd>
                {app.notes && (
                  <>
                    <dt className="text-muted-foreground">Notes</dt>
                    <dd className="text-(--text-2)">{app.notes}</dd>
                  </>
                )}
              </dl>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <p className="border-t border-border pt-4 text-[13px] text-muted-foreground tabular-nums">
        {applications.length} application{applications.length === 1 ? "" : "s"}
      </p>
    </>
  )
}
