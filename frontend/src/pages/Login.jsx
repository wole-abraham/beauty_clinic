import { useState } from "react"
import { Link } from "react-router-dom"
import { useLogin } from "../hooks/useAuth"

export default function Login() {
  const login = useLogin()
  const [form, setForm] = useState({ email: "", password: "" })
  const [err, setErr] = useState("")

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    try {
      await login.mutateAsync(form)
    } catch {
      setErr("Invalid email or password.")
    }
  }

  return (
    <div className="login-split">
      <div className="login-left">
        <img src="/images/logo.png" alt="Logo" className="login-left-logo" onError={e => e.target.style.display = "none"} />
        <p className="login-left-eyebrow">Beauty Clinic</p>
        <h2 className="login-left-title">Mary Nassif<br />Chbat</h2>
        <p className="login-left-sub">Sign in to manage your appointments and experience the art of beauty.</p>
        <img src="/images/about.jpg" alt="Beauty" className="login-left-img" onError={e => e.target.style.display = "none"} />
      </div>

      <div className="login-right">
        <div className="login-form-box">
          <p className="login-form-eyebrow">Welcome back</p>
          <h1 className="login-form-title">Sign In</h1>
          <p className="login-form-sub">Enter your credentials to continue</p>

          {err && <div className="form-error" style={{ marginBottom: 20 }}>{err}</div>}

          <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={set("password")}
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-pink btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="login-footer">
            Don&apos;t have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
