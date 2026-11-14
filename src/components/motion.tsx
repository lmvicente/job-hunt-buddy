"use client"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"

type FadeInProps = HTMLMotionProps<"div"> & { delay?: number; y?: number }

// Soft fade + rise + de-blur on mount. Respects reduced-motion settings.
export function FadeIn({ delay = 0, y = 14, ...props }: FadeInProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  )
}
