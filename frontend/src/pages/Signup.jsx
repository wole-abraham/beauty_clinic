import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRegister } from "../hooks/useAuth"

export default function Signup() {
  const navigate = useNavigate()
  const register = useRegister()
  const [form, setForm] = useState({ username: "", email: "", first_name: "", last_name: "", password: "" })
  const [err, setErr] = useState("")

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    try {
      await register.mutateAsync(form)
      navigate("/login")
    } catch (ex) {
      setErr(ex?.response?.data?.detail || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <img src="/images/logo.png" alt="Logo" className="signup-logo" onError={e => e.target.style.display="none"} />
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-sub">Join Mary Nassif Chbat and start your beauty journey</p>
        {err && <div className="form-error" style={{ marginBottom: 20 }}>{err}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" placeholder="Jane" required value={form.first_name} onChange={set("first_name")} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" placeholder="Doe" required value={form.last_name} onChange={set("last_name")} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" placeholder="jane_doe" required value={form.username} onChange={set("username")} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="jane@example.com" required value={form.email} onChange={set("email")} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" required value={form.password} onChange={set("password")} />
          </div>
          <button type="submit" className="btn btn-pink" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} disabled={register.isPending}>
            {register.isPending ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.87rem", color: "var(--muted)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--pink)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
