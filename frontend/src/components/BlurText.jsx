import { motion } from "framer-motion"

// Word-by-word blur-in reveal (adapted from the motionsites cinematic pattern).
// Renders an inline-flex wrapping container; each word clears blur + rises into place.
export default function BlurText({
  text = "",
  className = "",
  delay = 100,            // ms between words
  as: Tag = "h2",
  once = true,
  center = false,
}) {
  const words = text.split(" ")

  return (
    <Tag className={className} style={{ display: "flex", flexWrap: "wrap", rowGap: "0.1em", justifyContent: center ? "center" : "flex-start" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.28em", willChange: "transform, filter, opacity" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 36 }}
          whileInView={{
            filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
            opacity: [0, 0.5, 1],
            y: [36, -4, 0],
          }}
          viewport={{ once, amount: 0.2 }}
          transition={{ duration: 0.7, times: [0, 0.5, 1], ease: "easeOut", delay: (i * delay) / 1000 }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
