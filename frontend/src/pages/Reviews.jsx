import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/api"
import { useMe } from "../hooks/useAuth"

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
        <div className="section-center" style={{ marginBottom: 48 }}>
          <span className="section-tag">Feedback</span>
          <h1 className="section-title">Client Reviews</h1>
          <p className="section-desc">Real experiences from our valued clients. We love hearing from you!</p>
        </div>

        {user && (
          <div className="review-form-card">
            <h3 style={{ marginBottom: 6 }}>Leave a Review</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 20 }}>How was your experience?</p>
            {submitted && <div style={{ background: "#d1fae5", color: "#065f46", padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: "0.88rem" }}>Review submitted successfully!</div>}
            <Stars value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            <div className="form-group">
              <textarea className="form-textarea" placeholder="Share your experience with us..." value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
            </div>
            <button className="btn btn-pink" onClick={() => submit.mutate()} disabled={submit.isPending || !form.comment.trim()}>
              {submit.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {!user && (
          <div style={{ textAlign: "center", padding: "40px 0 56px", color: "var(--muted)" }}>
            <p style={{ marginBottom: 16 }}>Sign in to leave a review</p>
            <a href="/login" className="btn btn-outline">Sign In</a>
          </div>
        )}

        {isLoading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-star empty-icon" />
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(r => (
              <div key={r.id} className="review-card">
                <DisplayStars n={parseInt(r.rating) || 5} />
                <p className="review-text">&ldquo;{r.comment}&rdquo;</p>
                <div className="review-author">
                  <div className="review-avatar">{(r.user?.first_name || r.user?.username || "?")[0].toUpperCase()}</div>
                  <div>
                    <div className="review-name">{r.user?.first_name ? (r.user.first_name + " " + (r.user.last_name||"")).trim() : r.user?.username}</div>
                    <div className="review-date">{new Date(r.date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
