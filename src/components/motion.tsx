"use client"
import { MotionConfig, motion, type HTMLMotionProps } from "framer-motion"

// Wraps the app so every motion component respects the OS "Reduce motion" setting.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

// Entrance: from scale 0.97 + opacity 0 (never from 0), ease-out, under 300ms.
export const easeOut = [0.23, 1, 0.32, 1] as const
export const easeIn = [0.4, 0, 1, 1] as const

type FadeInProps = HTMLMotionProps<"div"> & { delay?: number }

export function FadeIn({ delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.26, delay, ease: easeOut }}
      {...props}
    />
  )
}
