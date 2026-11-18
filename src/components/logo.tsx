import { Check } from "lucide-react"

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid size-[22px] place-items-center rounded-[7px] bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(0_0_0/0.15)]">
        <Check className="size-3" strokeWidth={3} aria-hidden="true" />
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.01em]">Job Hunt Buddy</span>
    </span>
  )
}
