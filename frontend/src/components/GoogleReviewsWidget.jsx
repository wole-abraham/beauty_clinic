import { useState, useEffect } from "react"

const ELFSIGHT_APP_ID = "6a24d6b6-b84d-447b-bc02-368996ef5dad"

export default function GoogleReviewsWidget({ showHeader = true }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!ELFSIGHT_APP_ID) return
    if (document.querySelector('script[src*="elfsight"]')) {
      if (window.eapps) window.eapps.Platform.start()
      setLoaded(true)
      return
    }
    const script = document.createElement("script")
    script.src = "https://elfsightcdn.com/platform.js"
    script.async = true
    script.onload = () => setLoaded(true)
    document.body.appendChild(script)
    setTimeout(() => setLoaded(true), 2500)
  }, [])

  if (!ELFSIGHT_APP_ID) return null

  return (
    <div>
      {showHeader && (
        <div className="section-center" style={{ marginBottom: 28 }}>
          <span className="section-tag">From Google</span>
          <h2 style={{ fontSize: "1.6rem", fontFamily: "'Bodoni Moda', serif" }}>What Google Says</h2>
        </div>
      )}

      {!loaded && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg)", animation: "pulse 1.4s ease infinite" }} />
                <div>
                  <div style={{ width: 100, height: 12, borderRadius: 6, background: "var(--bg)", marginBottom: 6, animation: "pulse 1.4s ease infinite" }} />
                  <div style={{ width: 70, height: 10, borderRadius: 6, background: "var(--bg)", animation: "pulse 1.4s ease infinite 0.2s" }} />
                </div>
              </div>
              <div style={{ width: "100%", height: 10, borderRadius: 6, background: "var(--bg)", marginBottom: 8, animation: "pulse 1.4s ease infinite 0.1s" }} />
              <div style={{ width: "85%", height: 10, borderRadius: 6, background: "var(--bg)", marginBottom: 8, animation: "pulse 1.4s ease infinite 0.2s" }} />
              <div style={{ width: "60%", height: 10, borderRadius: 6, background: "var(--bg)", animation: "pulse 1.4s ease infinite 0.3s" }} />
            </div>
          ))}
        </div>
      )}

      <div className={`elfsight-app-${ELFSIGHT_APP_ID}`} />
    </div>
  )
}
