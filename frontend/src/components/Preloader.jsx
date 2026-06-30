import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader() {
  const [phase, setPhase] = useState("logo") // logo → text → exit
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 900)
    const t2 = setTimeout(() => setPhase("exit"), 2000)
    const t3 = setTimeout(() => setDone(true), 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (done) return null

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          style={{
            position: "fixed", inset: 0, zIndex: 999999,
            background: "#0E0710",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 20,
          }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img
              src="/images/logo.png"
              alt="MNC"
              style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover",
                boxShadow: "0 0 40px rgba(255,79,157,0.35)", border: "2px solid rgba(197,168,128,0.3)" }}
            />
          </motion.div>

          {/* Clinic name */}
          <div style={{ overflow: "hidden" }}>
            <motion.p
              initial={{ y: "100%" }}
              animate={{ y: phase !== "logo" ? "0%" : "100%" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontFamily: "'Bodoni Moda', serif", fontStyle: "italic",
                fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                color: "rgba(197,168,128,0.9)", letterSpacing: 2,
                margin: 0,
              }}
            >
              Mary Nassif Chbat
            </motion.p>
          </div>

          {/* Tagline */}
          <div style={{ overflow: "hidden" }}>
            <motion.p
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: phase !== "logo" ? "0%" : "100%", opacity: phase !== "logo" ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                color: "rgba(255,255,255,0.35)", fontSize: "0.72rem",
                letterSpacing: 6, textTransform: "uppercase", margin: 0,
              }}
            >
              Beauty Clinic · Lebanon
            </motion.p>
          </div>

          {/* Progress bar */}
          <motion.div
            style={{
              position: "absolute", bottom: 0, left: 0, height: 2,
              background: "linear-gradient(90deg, #FF4F9D, #C5A880)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: phase === "exit" ? "100%" : phase === "text" ? "60%" : "30%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
