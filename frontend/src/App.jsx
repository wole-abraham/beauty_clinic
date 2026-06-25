import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Navbar } from "./components/Navbar"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Bookings from "./pages/Bookings"
import Appointments from "./pages/Appointments"
import Reviews from "./pages/Reviews"
import Admin from "./pages/Admin"
import About from "./pages/About"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route
            path="/bookings"
            element={<ProtectedRoute><Bookings /></ProtectedRoute>}
          />
          <Route
            path="/appointments"
            element={<ProtectedRoute><Appointments /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute staffOnly><Admin /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
