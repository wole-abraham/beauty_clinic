import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useLogin } from "../hooks/useAuth"

export default function Login() {
  const navigate = useNavigate()
  const login = useLogin()
  const [form, setForm] = useState({ username: "", password: "" })
  const [err, setErr] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    try {
      await login.mutateAsync(form)
      navigate("/")
    } catch {
      setErr("Invalid username or password.")
    }
  }

  return (
    <div className="login-split">
      <div className="login-left">
        <img src="/images/logo.png" alt="Logo" className="login-left-logo" onError={e => e.target.style.display="none"} />
        <h2 className="login-left-title">Welcome Back</h2>
        <p className="login-left-sub">Sign in to manage your appointments and beauty treatments at Mary Nassif Chbat.</p>
        <img src="/img/makeupp.jpg" alt="Beauty" className="login-left-img" onError={e => e.target.style.display="none"} />
      </div>
      <div className="login-right">
        <div className="login-form-box">
          <h1 className="login-form-title">Sign In</h1>
          <p className="login-form-sub">Enter your credentials to continue</p>
          {err && <div className="form-error">{err}</div>}
          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" placeholder="your_username" required
                value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-pink" style={{ width: "100%", marginTop: 8, justifyContent: "center" }} disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="login-footer">Don&apos;t have an account? <Link to="/signup">Create one</Link></p>
        </div>
      </div>
    </div>
  )
}
