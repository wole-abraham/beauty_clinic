import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
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
import { pageVariants } from "./lib/motion"

const queryClient = new QueryClient()

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function ScrollReset() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="sync">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/reviews" element={<PageWrapper><Reviews /></PageWrapper>} />
        <Route path="/bookings" element={<PageWrapper><ProtectedRoute><Bookings /></ProtectedRoute></PageWrapper>} />
        <Route path="/appointments" element={<PageWrapper><ProtectedRoute><Appointments /></ProtectedRoute></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollReset />
        <Navbar />
        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
