import type { Status } from "@/lib/db/schema"

// Muted status colors: blue = in progress, green = good news,
// red = closed out, sand = waiting, grey = nothing happening.
// Each class sets the text color; the dot uses `bg-current`.
export const statusStyles: Record<Status, string> = {
  Applied: "text-[#57534e] dark:text-[#c9c5c0]",
  Screening: "text-[#4a6380] dark:text-[#b4c4d9]",
  Interview: "text-[#3a506b] dark:text-[#a9bbd3]",
  Offer: "text-[#2f6b58] dark:text-[#99e195]",
  Rejected: "text-[#9e4a4f] dark:text-[#e0979b]",
  Withdrawn: "text-[#6e6a66] dark:text-[#a19d98]",
  Dormant: "text-[#7a5c2b] dark:text-[#d4b483]",
  Ghosted: "text-[#78716c] dark:text-[#8a8580]",
}
