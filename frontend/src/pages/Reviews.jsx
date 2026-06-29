import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/api"
import { useMe } from "../hooks/useAuth"

// ─── Replace this with your Elfsight app ID once you create the widget ───────
// Sign up free at https://elfsight.com → Create Widget → Google Reviews
// Your ID looks like: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
const ELFSIGHT_APP_ID = "6a24d6b6-b84d-447b-bc02-368996ef5dad"

function GoogleReviewsWidget() {
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
    // show widget after short delay even if onload doesn't fire
    setTimeout(() => setLoaded(true), 2500)
  }, [])

  if (!ELFSIGHT_APP_ID) return null

  return (
    <div style={{ marginBottom: 56 }}>
      <div className="section-center" style={{ marginBottom: 28 }}>
        <span className="section-tag">From Google</span>
        <h2 style={{ fontSize: "1.6rem", fontFamily: "'Bodoni Moda', serif" }}>What Google Says</h2>
      </div>

      {/* Skeleton shown while widget loads */}
      {!loaded && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[1,2,3].map(i => (
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

const Stars = ({ value, onChange }) => (
  <div className="star-row">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" className={"star-btn" + (n <= value ? " active" : "")} onClick={() => onChange(n)}>&#9733;</button>
    ))}
  </div>
)

const DisplayStars = ({ n }) => (
  <span className="review-stars">
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= n ? "#FFC107" : "#ddd" }}>&#9733;</span>)}
  </span>
)

export default function Reviews() {
  const queryClient = useQueryClient()
  const { data: user } = useMe()
  const [form, setForm] = useState({ comment: "", rating: 5 })
  const [submitted, setSubmitted] = useState(false)

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => { const { data } = await api.get("/reviews"); return data },
  })

  const submit = useMutation({
    mutationFn: async () => api.post("/reviews", { comment: form.comment, rating: String(form.rating) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] })
      setForm({ comment: "", rating: 5 })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    },
  })

  return (
    <div className="reviews-page">
      <div className="container">
        <div className="section-center page-header">
          <span className="section-tag">Feedback</span>
          <h1 className="section-title">Client Reviews</h1>
          <p className="section-desc">Real experiences from our valued clients. We love hearing from you!</p>
        </div>

        {/* Google Reviews Widget */}
        <GoogleReviewsWidget />

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 3, color: "var(--muted)", fontWeight: 700, whiteSpace: "nowrap" }}>
            Reviews on our site
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {/* Internal leave-a-review form */}
        {user && (
          <div className="review-form-card">
            <h3 style={{ marginBottom: 6, color: "var(--dark)" }}>Leave a Review</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 20 }}>How was your experience?</p>
            {submitted && (
              <div style={{ background: "rgba(255,79,157,0.10)", color: "var(--pink)", border: "1px solid rgba(255,79,157,0.3)", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "0.88rem" }}>
                Review submitted — thank you!
              </div>
            )}
            <Stars value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            <div className="form-group">
              <textarea className="form-textarea" placeholder="Share your experience with us..." value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn btn-pink" onClick={() => submit.mutate()} disabled={submit.isPending || !form.comment.trim()}>
                {submit.isPending ? "Submitting…" : "Submit Review"}
              </button>
              <a href="https://g.page/r/REPLACE_WITH_YOUR_GOOGLE_REVIEW_LINK/review" target="_blank" rel="noreferrer"
                className="btn btn-ghost btn-sm">
                <i className="fab fa-google" /> Also review on Google
              </a>
            </div>
          </div>
        )}

        {!user && (
          <div style={{ textAlign: "center", padding: "32px 0 48px", color: "var(--muted)" }}>
            <p style={{ marginBottom: 16 }}>Sign in to leave a review on our site</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/login" className="btn btn-pink btn-sm">Sign In</a>
              <a href="https://g.page/r/REPLACE_WITH_YOUR_GOOGLE_REVIEW_LINK/review" target="_blank" rel="noreferrer"
                className="btn btn-ghost btn-sm">
                <i className="fab fa-google" /> Review on Google
              </a>
            </div>
          </div>
        )}

        {/* Internal reviews grid */}
        {isLoading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : reviews.length > 0 ? (
          <div className="reviews-grid" style={{ marginTop: 40 }}>
            {reviews.map(r => (
              <div key={r.id} className="review-card">
                <DisplayStars n={parseInt(r.rating) || 5} />
                <p className="review-text">&ldquo;{r.comment}&rdquo;</p>
                <div className="review-author">
                  <div className="review-avatar">{(r.user?.first_name || r.user?.username || "?")[0].toUpperCase()}</div>
                  <div>
                    <div className="review-name">{r.user?.first_name ? (r.user.first_name + " " + (r.user.last_name || "")).trim() : r.user?.username}</div>
                    <div className="review-date">{new Date(r.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-star empty-icon" />
            <p>No site reviews yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  )
}
