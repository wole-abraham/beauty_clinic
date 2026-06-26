import { useState } from "react"
import { Link } from "react-router-dom"
import { useRegister } from "../hooks/useAuth"

const COUNTRIES = [
  "Lebanon","United Arab Emirates","Saudi Arabia","Kuwait","Qatar","Bahrain","Oman","Jordan","Egypt",
  "United States","United Kingdom","Canada","Australia","Germany","France","Sweden","Switzerland","Other"
]

export default function Signup() {
  const register = useRegister()
  const [form, setForm] = useState({
    first_name: "", last_name: "",
    email: "", phone_number: "",
    username: "",
    birth_date: "", gender: "Female",
    country: "", state: "",
    password: "", confirm_password: "",
  })
  const [err, setErr] = useState("")

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    if (form.password !== form.confirm_password) {
      setErr("Passwords do not match.")
      return
    }
    try {
      const { confirm_password, ...payload } = form
      await register.mutateAsync(payload)
    } catch (ex) {
      setErr(ex?.response?.data?.detail || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <img src="/images/logo.png" alt="Logo" className="signup-logo" onError={e => e.target.style.display = "none"} />
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-sub">Join Mary Nassif Chbat and start your beauty journey</p>

        {err && <div className="form-error" style={{ marginBottom: 20 }}>{err}</div>}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="signup-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" type="text" placeholder="Jane" required value={form.first_name} onChange={set("first_name")} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-input" type="text" placeholder="Doe" required value={form.last_name} onChange={set("last_name")} />
            </div>
          </div>

          {/* Contact */}
          <div className="signup-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="jane@example.com" required value={form.email} onChange={set("email")} autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="+961 3 000 000" value={form.phone_number} onChange={set("phone_number")} />
            </div>
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" placeholder="jane_doe" required value={form.username} onChange={set("username")} autoComplete="username" />
          </div>

          {/* Date of birth + Gender */}
          <div className="signup-row">
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input className="form-input" type="date" value={form.birth_date} onChange={set("birth_date")} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input form-select" value={form.gender} onChange={set("gender")}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="signup-row">
            <div className="form-group">
              <label className="form-label">Country</label>
              <select className="form-input form-select" value={form.country} onChange={set("country")}>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City / State</label>
              <input className="form-input" type="text" placeholder="Beirut" value={form.state} onChange={set("state")} />
            </div>
          </div>

          {/* Password */}
          <div className="signup-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" required value={form.password} onChange={set("password")} autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="••••••••" required value={form.confirm_password} onChange={set("confirm_password")} autoComplete="new-password" />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-pink btn-lg"
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
            disabled={register.isPending}
          >
            {register.isPending ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.87rem", color: "rgba(255,255,255,0.45)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--pink)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
