import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function Cursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)

  const dotX = useSpring(x, { stiffness: 1400, damping: 45 })
  const dotY = useSpring(y, { stiffness: 1400, damping: 45 })
  const ringX = useSpring(x, { stiffness: 160, damping: 26 })
  const ringY = useSpring(y, { stiffness: 160, damping: 26 })

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const over = e.target.closest("a, button, input, textarea, select, label, [role=button]")
      setHovering(!!over)
    }
    const onLeave = () => setVisible(false)

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null

  return (
    <>
      {/* Small dot — snappy */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 99999,
          pointerEvents: "none", mixBlendMode: "difference",
          x: dotX, y: dotY, translateX: "-50%", translateY: "-50%",
        }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.12 }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF4F9D" }} />
      </motion.div>

      {/* Ring — laggy spring */}
      <motion.div
        style={{
          position: "fixed", top: 0, left: 0, zIndex: 99998,
          pointerEvents: "none",
          x: ringX, y: ringY, translateX: "-50%", translateY: "-50%",
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: hovering ? 2.2 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          border: `1.5px solid ${hovering ? "#FF4F9D" : "rgba(255,79,157,0.45)"}`,
          transition: "border-color 0.2s",
        }} />
      </motion.div>
    </>
  )
}
