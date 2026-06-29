import { Link } from "react-router-dom"
import { useEffect, useRef } from "react"

const SPECIALTIES = [
  { icon: "fa-paint-brush", title: "Artistic Makeup",    desc: "From natural everyday looks to full glamour, we craft makeup that celebrates your unique beauty.", color: "#FF4F9D" },
  { icon: "fa-spa",         title: "Facial Treatments",  desc: "Rejuvenating facials and skincare routines designed to give you glowing, healthy skin.",           color: "#C5A880" },
  { icon: "fa-gem",         title: "Nail Care",           desc: "Expert nail care with premium products, from classic polish to intricate nail art designs.",        color: "#FF4F9D" },
  { icon: "fa-eye",         title: "Eyelash Perming",     desc: "Natural-looking lash lifts and perms that make your eyes pop without the daily maintenance.",       color: "#C5A880" },
  { icon: "fa-magic",       title: "Wax Care",            desc: "Smooth, gentle waxing treatments for lasting results with minimal discomfort.",                     color: "#FF4F9D" },
  { icon: "fa-star",        title: "Mesotherapy",         desc: "Advanced rejuvenation treatments for radiant, youthful, glowing skin.",                             color: "#C5A880" },
]

function useReveal(ref) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal")
    if (!els) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("revealed"); io.unobserve(e.target) } })
    }, { threshold: 0.15 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [ref])
}

export default function About() {
  const specialtiesRef = useRef(null)
  const heroRef = useRef(null)
  useReveal(specialtiesRef)
  useReveal(heroRef)

  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="about-page-hero" ref={heroRef}>
        <div className="container">
          <div className="about-page-grid">

            {/* Text side */}
            <div>
              <span className="section-tag reveal reveal-up" style={{ animationDelay: "0ms" }}>About Us</span>
              <h1 className="section-title reveal reveal-up" style={{ "--delay": "80ms" }}>
                Mary Nassif Chbat<br />
                <em style={{ color: "var(--pink)", fontStyle: "italic" }}>Beauty Clinic</em>
              </h1>
              <p className="reveal reveal-up" style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: 8, "--delay": "160ms" }}>
                At Mary Nassif Chbat, we bring you the best in beauty. We specialize in providing high-quality treatments tailored to your needs, whether you are looking for a rejuvenating facial, advanced skincare, or a complete beauty transformation.
              </p>
              <p className="reveal reveal-up" style={{ color: "var(--muted)", lineHeight: 1.8, marginBottom: 32, "--delay": "220ms" }}>
                Our expert team is committed to delivering results that not only meet but exceed your expectations. With years of experience and a passion for enhancing natural beauty, we are here to help you look and feel your best.
              </p>

              <div className="about-info-list reveal reveal-up" style={{ "--delay": "300ms" }}>
                <div className="about-info-row">
                  <i className="fas fa-map-marker-alt about-info-icon" />
                  <span>Sed El Boushrieh, Ossaily Street, Lebanon</span>
                </div>
                <div className="about-info-row">
                  <i className="fas fa-phone about-info-icon" />
                  <a href="https://wa.me/9613799407" style={{ color: "var(--muted)" }}>+961 3 799 407</a>
                </div>
                <div className="about-info-row">
                  <i className="fas fa-envelope about-info-icon" />
                  <a href="mailto:customerservice@marynassifchbat.com" style={{ color: "var(--muted)" }}>customerservice@marynassifchbat.com</a>
                </div>
              </div>

              <div className="about-socials reveal reveal-up" style={{ "--delay": "380ms" }}>
                <a href="https://web.facebook.com/marynassifchbat" className="btn btn-ghost btn-sm"><i className="fab fa-facebook-f" /> Facebook</a>
                <a href="https://www.instagram.com/marynassifchbat" className="btn btn-pink btn-sm"><i className="fab fa-instagram" /> Instagram</a>
                <a href="https://www.tiktok.com/@marynassifchbat" className="btn btn-ghost btn-sm"><i className="fab fa-tiktok" /> TikTok</a>
              </div>
            </div>

            {/* Logo side */}
            <div className="reveal reveal-scale" style={{ display: "flex", alignItems: "center", justifyContent: "center", "--delay": "200ms" }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", inset: -16,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,79,157,0.12) 0%, transparent 70%)",
                  animation: "aboutPulse 3s ease-in-out infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -32,
                  borderRadius: "50%",
                  border: "1px solid rgba(197,168,128,0.2)",
                  animation: "aboutSpin 18s linear infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -56,
                  borderRadius: "50%",
                  border: "1px dashed rgba(255,79,157,0.15)",
                  animation: "aboutSpin 28s linear infinite reverse",
                }} />
                <img
                  src="/images/logo.png"
                  alt="Mary Nassif Chbat Beauty Clinic"
                  style={{
                    width: 320, height: 320, objectFit: "cover",
                    borderRadius: "50%",
                    boxShadow: "0 0 0 6px rgba(197,168,128,0.15), 0 16px 64px rgba(197,168,128,0.25)",
                    display: "block", position: "relative", zIndex: 1,
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section style={{ padding: "100px 0", background: "var(--surface)" }} ref={specialtiesRef}>
        <div className="container">
          <div className="section-center reveal reveal-up" style={{ marginBottom: 64, "--delay": "0ms" }}>
            <span className="section-tag">What We Do</span>
            <h2 className="section-title">Our Specialties</h2>
            <p className="section-desc" style={{ maxWidth: 480, margin: "0 auto" }}>Every treatment is a ritual — crafted with care, precision, and a deep passion for beauty.</p>
          </div>

          <div className="specialties-grid">
            {SPECIALTIES.map(({ icon, title, desc, color }, i) => (
              <div key={title} className="specialty-card reveal reveal-up" style={{ "--delay": `${i * 80}ms` }}>
                <div className="specialty-card-inner">
                  <div className="specialty-icon-wrap" style={{ "--color": color }}>
                    <i className={"fas " + icon} />
                    <div className="specialty-icon-ring" />
                  </div>
                  <h3 className="specialty-title">{title}</h3>
                  <p className="specialty-desc">{desc}</p>
                  <div className="specialty-line" style={{ background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 0", background: "var(--bg)", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <span className="section-tag">Get Started</span>
          <h2 style={{ color: "var(--dark)", marginBottom: 16, fontFamily: "'Bodoni Moda', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>Ready to Experience the Difference?</h2>
          <p style={{ color: "var(--muted)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
            Book your appointment today and discover why clients keep coming back.
          </p>
          <Link to="/bookings" className="btn btn-pink btn-lg">Book Now</Link>
        </div>
      </section>

    </div>
  )
}
