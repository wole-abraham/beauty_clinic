import { Navigate } from "react-router-dom"
import { useMe } from "../hooks/useAuth"

export function ProtectedRoute({ children, staffOnly = false }) {
  const { data: user, isLoading, isError } = useMe()

  if (isLoading) return <div className="container mt-5 text-center"><p>Loading…</p></div>
  if (isError || !user) return <Navigate to="/login" replace />
  if (staffOnly && !user.is_staff && !user.is_superuser) return <Navigate to="/" replace />

  return children
}
