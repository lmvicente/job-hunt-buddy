"use client"
import { motion, useReducedMotion } from "framer-motion"

// Fixed positions so server and client render the same markup.
const DOTS = [
  { x: "12%", y: "18%", size: 140, blur: 30, opacity: 0.18, dur: 18 },
  { x: "78%", y: "12%", size: 90, blur: 18, opacity: 0.22, dur: 14 },
  { x: "64%", y: "58%", size: 200, blur: 50, opacity: 0.12, dur: 22 },
  { x: "22%", y: "72%", size: 70, blur: 12, opacity: 0.2, dur: 16 },
  { x: "88%", y: "80%", size: 120, blur: 28, opacity: 0.16, dur: 20 },
  { x: "45%", y: "30%", size: 46, blur: 8, opacity: 0.22, dur: 12 },
  { x: "6%", y: "48%", size: 54, blur: 10, opacity: 0.16, dur: 15 },
  { x: "52%", y: "88%", size: 64, blur: 14, opacity: 0.14, dur: 17 },
]

export default function BokehBackground() {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#0f282f_0%,#081a1f_55%,#061317_100%)]" />

      {/* Large glow blobs */}
      <motion.div
        className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full bg-[#02eff0] opacity-[0.16] blur-[140px]"
        animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-48 top-1/3 h-[560px] w-[560px] rounded-full bg-[#0f8f95] opacity-[0.22] blur-[140px]"
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-56 left-1/4 h-[520px] w-[720px] rounded-full bg-[#0a5c62] opacity-[0.3] blur-[160px]"
        animate={reduce ? undefined : { x: [0, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Diagonal light beam from the top-left */}
      <div className="absolute -top-24 left-[8%] h-[900px] w-[220px] -rotate-[28deg] bg-gradient-to-b from-[#84f6f7]/25 via-[#02eff0]/5 to-transparent blur-3xl" />

      {/* Bokeh dots */}
      {DOTS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[radial-gradient(circle,#c2fbfb_0%,#02eff0_45%,transparent_70%)]"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            filter: `blur(${d.blur}px)`,
            opacity: d.opacity,
          }}
          animate={
            reduce
              ? undefined
              : { y: [0, -24, 0], opacity: [d.opacity, d.opacity * 1.6, d.opacity] }
          }
          transition={{ duration: d.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
        />
      ))}

      {/* Grid + subtle vignette */}
      <div className="bg-grid absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(4_14_17/0.7)_100%)]" />
    </div>
  )
}
