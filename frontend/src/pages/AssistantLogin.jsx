import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import api from "../lib/api"

export default function AssistantLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [err, setErr] = useState("")

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const login = useMutation({
    mutationFn: async ({ email, password }) => {
      const body = new URLSearchParams()
      body.append("username", email)
      body.append("password", password)
      const { data: tokenData } = await api.post("/auth/login", body)
      localStorage.setItem("token", tokenData.access_token)
      const { data: me } = await api.get("/auth/me")
      return me
    },
    onSuccess: (user) => {
      if (user.is_staff || user.is_superuser) {
        navigate("/admin")
      } else {
        localStorage.removeItem("token")
        setErr("Access denied. Staff accounts only.")
      }
    },
    onError: () => {
      localStorage.removeItem("token")
      setErr("Invalid email or password.")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setErr("")
    login.mutate(form)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--dark)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#1a1a2e",
        borderRadius: 20,
        padding: "48px 40px",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--pink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <i className="fas fa-shield-alt" style={{ color: "#fff", fontSize: "1.2rem" }} />
          </div>
          <p style={{ color: "var(--pink)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
            Staff Access
          </p>
          <h1 style={{ color: "#fff", fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>
            Assistant Portal
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: 8 }}>
            Authorised personnel only
          </p>
        </div>

        {err && (
          <div style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10,
            padding: "12px 16px",
            color: "#fca5a5",
            fontSize: "0.85rem",
            marginBottom: 24,
            textAlign: "center",
          }}>
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, marginBottom: 8, letterSpacing: "0.05em" }}>
              EMAIL
            </label>
            <input
              type="email"
              required
              placeholder="staff@example.com"
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, marginBottom: 8, letterSpacing: "0.05em" }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "#fff",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            style={{
              width: "100%",
              padding: "14px",
              background: "var(--pink)",
              border: "none",
              borderRadius: 10,
              color: "#fff",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: login.isPending ? "not-allowed" : "pointer",
              opacity: login.isPending ? 0.7 : 1,
              transition: "opacity 0.2s",
              letterSpacing: "0.02em",
            }}
          >
            {login.isPending ? "Verifying…" : "Access Dashboard →"}
          </button>
        </form>
      </div>
    </div>
  )
}
