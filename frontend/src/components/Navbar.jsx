import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useMe, useLogout } from "../hooks/useAuth"

export function Navbar() {
  const { data: user } = useMe()
  const logout = useLogout()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); setOpen(false); navigate("/") }

  const link = (to, label, end = false) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
      onClick={() => setOpen(false)}
    >
      {label}
    </NavLink>
  )

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <img src="/images/logo.png" alt="Logo" className="navbar-logo" onError={e => e.target.style.display = "none"} />
            <span className="navbar-name">Mary Nassif Chbat</span>
          </Link>

          <div className="navbar-links">
            {link("/", "Home", true)}
            {link("/about", "About")}
            {link("/reviews", "Reviews")}
            {link("/bookings", "Bookings")}
            {link("/appointments", "Appointments")}
            {(user?.is_staff || user?.is_superuser) && link("/admin", "Dashboard")}
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Hi, {user.first_name || user.username}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/signup" className="btn btn-pink btn-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="navbar-toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <i className={`fas fa-${open ? "times" : "bars"}`}></i>
          </button>
        </div>

        <div className={`navbar-mobile${open ? " open" : ""}`}>
          {link("/", "Home", true)}
          {link("/about", "About")}
          {link("/reviews", "Reviews")}
          {link("/bookings", "Bookings")}
          {link("/appointments", "Appointments")}
          {(user?.is_staff || user?.is_superuser) && link("/admin", "Dashboard")}
          <div style={{ padding: "12px 20px", display: "flex", gap: 8, borderTop: "1px solid var(--border)", marginTop: 8 }}>
            {user ? (
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/signup" className="btn btn-pink btn-sm" onClick={() => setOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
