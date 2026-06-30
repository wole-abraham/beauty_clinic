import { useMemo } from "react"

export default function FloatingParticles({ count = 28 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 2 + (i / count) * 96,
      delay: -(i / count) * 14,
      duration: 9 + (i % 6) * 1.8,
      size: 1.5 + (i % 4),
      color: i % 3 === 0 ? "#FF4F9D" : i % 3 === 1 ? "#C5A880" : "rgba(197,168,128,0.7)",
      drift: ((i % 9) - 4) * 18,
    }))
  , [count])

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-8px",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            animation: `particleFloat ${p.duration}s ${p.delay}s infinite ease-in-out`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}
