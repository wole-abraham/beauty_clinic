import { useState, useRef, useCallback, useEffect } from "react"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

const state = { idle: "idle", loading: "loading", done: "done", error: "error" }

export default function RemoveBg() {
  const [status, setStatus] = useState(state.idle)
  const [original, setOriginal] = useState(null)
  const [result, setResult] = useState(null)
  const [errMsg, setErrMsg] = useState("")
  const [drag, setDrag] = useState(false)
  const [sliderX, setSliderX] = useState(50)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)
  const wrapRef = useRef(null)

  const process = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) { setErrMsg("Please upload an image file."); setStatus(state.error); return }
    setOriginal(URL.createObjectURL(file))
    setResult(null)
    setSliderX(50)
    setStatus(state.loading)
    setErrMsg("")
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch(API + "/tools/remove-bg", { method: "POST", body: fd })
      if (!res.ok) { const j = await res.json(); throw new Error(j.detail || "Server error") }
      const blob = await res.blob()
      setResult(URL.createObjectURL(blob))
      setStatus(state.done)
    } catch (e) {
      setErrMsg(e.message)
      setStatus(state.error)
    }
  }, [])

  const onFiles = (files) => { if (files?.[0]) process(files[0]) }

  const onDrop = (e) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files) }
  const onDragOver = (e) => { e.preventDefault(); setDrag(true) }
  const onDragLeave = () => setDrag(false)

  useEffect(() => {
    const onPaste = (e) => {
      const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith("image/"))
      if (item) process(item.getAsFile())
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [process])

  const onMouseMove = useCallback((e) => {
    if (!dragging || !wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
    setSliderX(pct)
  }, [dragging])

  const onMouseUp = useCallback(() => setDragging(false), [])
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp) }
  }, [dragging, onMouseMove, onMouseUp])

  const reset = () => { setStatus(state.idle); setOriginal(null); setResult(null); setErrMsg("") }

  const download = () => {
    const a = document.createElement("a"); a.href = result; a.download = "removed_bg.png"; a.click()
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", padding: "60px 0 100px" }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-tag">AI Tool</span>
          <h1 className="section-title">Background Remover</h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>Upload or paste any image and the AI will instantly remove the background.</p>
        </div>

        {status === state.idle || status === state.error ? (
          <div
            onClick={() => fileRef.current.click()}
            onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
            style={{
              border: "2.5px dashed " + (drag ? "var(--pink)" : "var(--border)"),
              borderRadius: 20, padding: "72px 40px", textAlign: "center",
              background: drag ? "var(--pink-light)" : "#fff",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--pink-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "1.8rem", color: "var(--pink)" }}>
              <i className="fas fa-cloud-upload-alt" />
            </div>
            <h3 style={{ marginBottom: 10, fontSize: "1.4rem" }}>Drop your image here</h3>
            <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.92rem" }}>
              or click to browse &nbsp;·&nbsp; or <kbd style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 5, padding: "2px 7px", fontSize: "0.82rem" }}>Ctrl+V</kbd> to paste
            </p>
            <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>PNG, JPG, WEBP &nbsp;·&nbsp; Max 20 MB</span>
            {status === state.error && (
              <div className="form-error" style={{ marginTop: 20 }} onClick={e => e.stopPropagation()}>{errMsg}</div>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => onFiles(e.target.files)} />
          </div>
        ) : status === state.loading ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: "80px 40px", textAlign: "center", boxShadow: "var(--shadow)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid var(--border)", borderTopColor: "var(--pink)", animation: "spin 0.8s linear infinite", margin: "0 auto 28px" }} />
            <h3 style={{ marginBottom: 8 }}>Removing background...</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>This usually takes 3–10 seconds</p>
            {original && <img src={original} alt="preview" style={{ maxHeight: 180, maxWidth: "100%", margin: "32px auto 0", borderRadius: 12, opacity: 0.5, display: "block" }} />}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 2 }}>Background removed</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Drag the slider to compare. Checkerboard = transparent.</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-ghost btn-sm" onClick={reset}><i className="fas fa-redo" /> New Image</button>
                <button className="btn btn-pink btn-sm" onClick={download}><i className="fas fa-download" /> Download PNG</button>
              </div>
            </div>

            <div ref={wrapRef} style={{ position: "relative", overflow: "hidden", cursor: "ew-resize", userSelect: "none" }} onMouseDown={() => setDragging(true)}>
              <div style={{ background: "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 20px 20px", lineHeight: 0 }}>
                <img src={result} alt="result" style={{ width: "100%", height: "auto", display: "block", maxHeight: 520, objectFit: "contain" }} />
              </div>

              <div style={{ position: "absolute", top: 0, left: 0, width: sliderX + "%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
                <img src={original} alt="original" style={{ width: wrapRef.current?.offsetWidth + "px", maxWidth: "none", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              <div style={{ position: "absolute", top: 0, left: "calc(" + sliderX + "% - 1px)", width: 2, height: "100%", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.15)", pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "0.75rem", gap: 3 }}>
                  <i className="fas fa-chevron-left" /><i className="fas fa-chevron-right" />
                </div>
              </div>

              <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, pointerEvents: "none", textTransform: "uppercase", letterSpacing: 1 }}>Original</div>
              <div style={{ position: "absolute", top: 12, right: 12, background: "var(--pink)", color: "#fff", fontSize: "0.72rem", fontWeight: 600, padding: "4px 10px", borderRadius: 6, pointerEvents: "none", textTransform: "uppercase", letterSpacing: 1 }}>Removed</div>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 40 }}>
          {[
            { icon: "fa-bolt", title: "Instant AI", desc: "U2Net AI model removes backgrounds in seconds with high precision." },
            { icon: "fa-paste", title: "Paste to Upload", desc: "Press Ctrl+V anywhere on this page to instantly paste a screenshot or copied image." },
            { icon: "fa-image", title: "Transparent PNG", desc: "Output is always a lossless PNG with a fully transparent background." },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: "#fff", borderRadius: 14, padding: "24px 20px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--pink-light)", color: "var(--pink)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.1rem" }}>
                <i className={"fas " + icon} />
              </div>
              <h4 style={{ fontSize: "0.92rem", marginBottom: 6 }}>{title}</h4>
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
