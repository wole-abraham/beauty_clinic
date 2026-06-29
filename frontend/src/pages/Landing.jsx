import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import api from "../lib/api"
import { useState } from "react"

const SERVICES = [
  { title: "Nail Care", img: "/img/nailcare.jpg", desc: "Expert nail care from classic treatments to stunning nail art. Enjoy healthy, stylish nails with personalized care and premium products." },
  { title: "Artistic Makeup", img: "/img/makeup5.jpg", desc: "Natural looks that let your skin glow with that romantic and sweet radiance perfect for any occasion." },
  { title: "Wax Care", img: "/img/waxcare.jpg", desc: "Professional wax care for smooth, flawless skin. Gentle, effective treatments tailored specifically to your needs." },
  { title: "Curling Eyelashes", img: "/img/services3.jpg", desc: "Eyelash perming that makes your eyes look bigger and brighter so effortless you can skip the mascara." },
  { title: "Facial Hair Removal", img: "/img/services-1.jpg", desc: "Fully licensed beauticians offering both temporary and permanent hair removal solutions." },
  { title: "Bridal Makeup", img: "/img/makeup2.jpg", desc: "Stunning bridal looks crafted to make you glow on your most special day." },
  { title: "Regular Makeup", img: "/img/makeup4.jpg", desc: "Cocktail parties, evening events, date nights, we bring out your best look for any occasion." },
  { title: "Facial Care", img: "/img/services-2.jpg", desc: "Personalized facial treatments for smoother, healthier, more radiant skin." },
  { title: "Mesotherapy", img: "/img/services-4.jpg", desc: "A rejuvenating treatment combining advanced techniques to deliver radiant, youthful skin." },
  { title: "Full Makeup", img: "/img/makeup1.jpg", desc: "A full spectrum of makeup services, bridal, regular, and artistic, tailored to your personal style." },
]


const HOURS = [
  ["Saturday","08:30 am - 6:00 pm"],["Sunday","08:30 am - 12:00 pm"],
  ["Monday","Closed"],["Tuesday","08:30 am - 6:00 pm"],
  ["Wednesday","Closed"],["Thursday","08:30 am - 6:00 pm"],["Friday","08:30 am - 6:00 pm"],
]

const stars = (n) => Array.from({ length: 5 }, (_, i) => (
  <span key={i} style={{ color: i < n ? "#FFC107" : "#ddd" }}>&#9733;</span>
))

export default function Landing() {
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => { const { data } = await api.get("/reviews"); return data },
  })
  const [showAll, setShowAll] = useState(false)
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3)



  return (
    <>
      <section className="hero">

        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="hero-eyebrow">Beauty Clinic</p>
              <h1 className="hero-title">GLOW</h1>
              <p className="hero-script">Mary Nassif Chbat</p>
              <p className="hero-sub">Discover the secret to radiant beauty with our premium services, designed to make you shine with confidence and elegance.</p>
              <div className="hero-cta">
                <Link to="/bookings" className="btn-premium">
                  <span>Book Appointment</span>
                  <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
            <div className="hero-img-wrap">
              <div className="hero-img-circle" />
              <img src="/images/hero-roses.png" alt="Beauty" className="hero-img" />
            </div>
          </div>
        </div>
        <div className="hero-flower-strip">
          <div className="hero-flower-inner">
            {Array.from({ length: 24 }, (_, i) => (
              <img key={i} src="/images/flower.svg" alt="" aria-hidden="true" />
            ))}
            {Array.from({ length: 24 }, (_, i) => (
              <img key={"b" + i} src="/images/flower.svg" alt="" aria-hidden="true" />
            ))}
          </div>
        </div>
      </section>


      <section className="services-section">
        <div className="container">
          <div className="services-intro">
            <div>
              <span className="section-tag">What We Offer</span>
              <h2 className="section-title">Our Services</h2>
              <p className="section-desc">Each treatment is carefully crafted to enhance your natural beauty and leave you feeling confident and radiant.</p>
            </div>
            <div className="services-intro-cta">
              <Link to="/bookings" className="btn-premium">
                <span>Book Now</span>
                <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>

          <div className="services-masonry">
            {SERVICES.map((s, i) => (
              <Link
                to="/bookings"
                key={i}
                className="service-tile"
              >
                <img src={s.img} alt={s.title} onError={e => e.target.src = "/img/makeup.jpg"} />
                <div className="service-tile-overlay" />
<div className="service-tile-content">
                  <span className="service-tile-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="service-tile-name">{s.title}</h3>
                  <p className="service-tile-desc">{s.desc}</p>
                  <span className="service-tile-arrow">
                    Book Now <i className="fas fa-arrow-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="about-teaser">
        <div className="container">
          <div className="about-grid">
            <div className="about-logo-col">
              <div className="about-logo-wrap">
                <div className="about-logo-ring about-logo-ring--outer" />
                <div className="about-logo-ring about-logo-ring--inner" />
                <div className="about-logo-glow" />
                <img src="/images/logo.png" alt="Mary Nassif Chbat" className="about-main-img" />
                <div className="about-logo-dot about-logo-dot--1"><i className="fas fa-star" /></div>
                <div className="about-logo-dot about-logo-dot--2"><i className="fas fa-gem" /></div>
                <div className="about-logo-dot about-logo-dot--3"><i className="fas fa-spa" /></div>
              </div>
              <div className="about-stats-row">
                {[["500+","Happy Clients"],["5+","Years"],["10","Services"]].map(([n,l]) => (
                  <div key={l} className="about-stat">
                    <span className="about-stat-num">{n}</span>
                    <span className="about-stat-lbl">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-text-col">
              <span className="section-tag" style={{ color: "var(--pink)" }}>About Us</span>
              <p className="about-script-name">Mary Nassif Chbat</p>
              <h2 className="about-heading">Your Trusted<br /><em>Beauty Clinic</em></h2>
              <div className="about-divider" />
              <p className="about-body">
                We specialize in high-quality treatments tailored to your needs — from rejuvenating facials and advanced skincare to complete beauty transformations.
              </p>
              <div className="about-pillars">
                <div className="about-pillar">
                  <span className="about-pillar-icon"><i className="fas fa-star" /></span>
                  <span>Premium expertise</span>
                </div>
                <div className="about-pillar">
                  <span className="about-pillar-icon"><i className="fas fa-heart" /></span>
                  <span>Personalized care</span>
                </div>
                <div className="about-pillar">
                  <span className="about-pillar-icon"><i className="fas fa-spa" /></span>
                  <span>Relaxing atmosphere</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="reviews-section">
          <div className="container">
            <div className="section-center" style={{ marginBottom: 0 }}>
              <span className="section-tag">Testimonials</span>
              <h2 className="section-title">What Clients Say</h2>
            </div>
            <div className="reviews-grid">
              {visibleReviews.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-stars">{stars(parseInt(r.rating) || 5)}</div>
                  <p className="review-text">&ldquo;{r.comment}&rdquo;</p>
                  <div className="review-author">
                    <div className="review-avatar">{(r.user?.first_name || r.user?.username || "?")[0].toUpperCase()}</div>
                    <div>
                      <div className="review-name">{r.user?.first_name ? (r.user.first_name + " " + (r.user.last_name || "")).trim() : r.user?.username}</div>
                      <div className="review-date">{new Date(r.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {reviews.length > 3 && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <button className="btn btn-outline" onClick={() => setShowAll(s => !s)}>
                  {showAll ? "Show Less" : "See All " + reviews.length + " Reviews"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="cta-contact-section">
        <div className="cta-contact-top">
          <div className="container">
            <div className="cta-contact-grid">
              <div className="cta-left">
                <span className="section-tag" style={{ color: "var(--pink)" }}>Book a Session</span>
                <h2 className="cta-big-title">Ready to<br /><em>Glow?</em></h2>
                <p className="cta-big-sub">Let our expert team craft the perfect beauty experience for you — walk in, and walk out radiant.</p>
                <Link to="/bookings" className="btn-premium">
                  <span>Book Appointment</span>
                  <i className="fas fa-arrow-right" />
                </Link>
              </div>
              <div className="cta-right">
                <div className="hours-panel">
                  <div className="hours-panel-head">
                    <i className="fas fa-clock" />
                    <span>Opening Hours</span>
                  </div>
                  <div className="hours-panel-rows">
                    {HOURS.map(([d, h]) => (
                      <div key={d} className={"hours-panel-row" + (h === "Closed" ? " closed" : "")}>
                        <span className="hours-panel-day">{d}</span>
                        <span className="hours-panel-time">{h}</span>
                        <span className={"hours-dot" + (h === "Closed" ? " hours-dot--closed" : " hours-dot--open")} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-contact-bottom">
          <div className="contact-cards">
            <a href="https://maps.google.com/?q=Sed+El+Boushrieh+Ossaily+Street+Lebanon" className="contact-card" target="_blank" rel="noreferrer">
              <i className="fas fa-map-marker-alt contact-card-ico" />
              <span className="contact-card-label">Find Us</span>
              <span className="contact-card-val">Sed El Boushrieh, Ossaily Street, Lebanon</span>
              <span className="contact-card-cta">Get Directions <i className="fas fa-arrow-right" /></span>
            </a>
            <a href="https://wa.me/9613799407" className="contact-card contact-card--pink" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp contact-card-ico" />
              <span className="contact-card-label">WhatsApp Us</span>
              <span className="contact-card-val">+961 3 799 407</span>
              <span className="contact-card-cta">Message Now <i className="fas fa-arrow-right" /></span>
            </a>
            <a href="mailto:customerservice@marynassifchbat.com" className="contact-card">
              <i className="fas fa-envelope contact-card-ico" />
              <span className="contact-card-label">Email</span>
              <span className="contact-card-val">customerservice@marynassifchbat.com</span>
              <span className="contact-card-cta">Send Email <i className="fas fa-arrow-right" /></span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-body">
            <div className="footer-brand-col">
              <img src="/images/logo.png" alt="Logo" className="footer-logo-circle" onError={e => e.target.style.display = "none"} />
              <p className="footer-tagline">Beauty Institute<br /><em>Lebanon</em></p>
              <div className="footer-socials">
                <a href="https://web.facebook.com/marynassifchbat" className="social-btn"><i className="fab fa-facebook-f" /></a>
                <a href="https://www.instagram.com/marynassifchbat" className="social-btn"><i className="fab fa-instagram" /></a>
                <a href="https://www.tiktok.com/@marynassifchbat" className="social-btn"><i className="fab fa-tiktok" /></a>
              </div>
            </div>

            <div className="footer-links-col">
              <p className="footer-col-title">Services</p>
              <div className="footer-links">
                {["Nail Care","Makeup","Facial Care","Wax Care","Eyelashes","Mesotherapy"].map(s => (
                  <Link key={s} to="/bookings" className="footer-link">{s}</Link>
                ))}
              </div>
            </div>

            <div className="footer-links-col">
              <p className="footer-col-title">Quick Links</p>
              <div className="footer-links">
                <Link to="/" className="footer-link">Home</Link>
                <Link to="/about" className="footer-link">About Us</Link>
                <Link to="/reviews" className="footer-link">Reviews</Link>
                <Link to="/bookings" className="footer-link">Book Now</Link>
                <Link to="/appointments" className="footer-link">My Appointments</Link>
              </div>
            </div>

            <div className="footer-cta-col">
              <p className="footer-col-title">Ready to Glow?</p>
              <p className="footer-cta-sub">Book your next beauty session with us.</p>
              <Link to="/bookings" className="btn-premium" style={{ fontSize: "0.78rem", padding: "14px 24px" }}>
                <span>Book Now</span>
                <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>

          <div className="footer-bar">
            <span>&copy; {new Date().getFullYear()} Mary Nassif Chbat. All rights reserved.</span>
            <div className="footer-bar-links">
              <a href="https://web.facebook.com/marynassifchbat" className="footer-link">Facebook</a>
              <a href="https://www.instagram.com/marynassifchbat" className="footer-link">Instagram</a>
              <a href="https://www.tiktok.com/@marynassifchbat" className="footer-link">TikTok</a>
            </div>
          </div>
        </div>
      </footer>

    </>
  )
}
