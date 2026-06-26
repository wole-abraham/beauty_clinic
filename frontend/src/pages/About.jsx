import { Link } from "react-router-dom"

export default function About() {
  return (
    <div className="about-page">
      <section className="about-page-hero">
        <div className="container">
          <div className="about-page-grid">
            <div>
              <span className="section-tag">About Us</span>
              <h1 className="section-title">Mary Nassif Chbat<br />Beauty Clinic</h1>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 8 }}>
                At Mary Nassif Chbat, we bring you the best in beauty. We specialize in providing high-quality treatments tailored to your needs, whether you are looking for a rejuvenating facial, advanced skincare, or a complete beauty transformation.
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 28 }}>
                Our expert team is committed to delivering results that not only meet but exceed your expectations. With years of experience and a passion for enhancing natural beauty, we are here to help you look and feel your best.
              </p>
              <div className="about-info-list">
                <div className="about-info-row">
                  <i className="fas fa-map-marker-alt about-info-icon" />
                  <span>Sed El Boushrieh, Ossaily Street, Lebanon</span>
                </div>
                <div className="about-info-row">
                  <i className="fas fa-phone about-info-icon" />
                  <a href="https://wa.me/9613799407" style={{ color: "rgba(255,255,255,0.65)" }}>+961 3 799 407</a>
                </div>
                <div className="about-info-row">
                  <i className="fas fa-envelope about-info-icon" />
                  <a href="mailto:customerservice@marynassifchbat.com" style={{ color: "rgba(255,255,255,0.65)" }}>customerservice@marynassifchbat.com</a>
                </div>
              </div>
              <div className="about-socials">
                <a href="https://web.facebook.com/marynassifchbat" className="btn btn-ghost btn-sm"><i className="fab fa-facebook-f" /> Facebook</a>
                <a href="https://www.instagram.com/marynassifchbat" className="btn btn-pink btn-sm"><i className="fab fa-instagram" /> Instagram</a>
                <a href="https://www.tiktok.com/@marynassifchbat" className="btn btn-ghost btn-sm"><i className="fab fa-tiktok" /> TikTok</a>
              </div>
            </div>
            <div>
              <img src="/images/about.jpg" alt="Mary Nassif Chbat Beauty Clinic" className="about-page-img" onError={e => e.target.src = "/img/team.jpg"} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#0E0710" }}>
        <div className="container">
          <div className="section-center" style={{ marginBottom: 48 }}>
            <span className="section-tag">What We Do</span>
            <h2 className="section-title">Our Specialties</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "fa-paint-brush", title: "Artistic Makeup", desc: "From natural everyday looks to full glamour, we craft makeup that celebrates your unique beauty." },
              { icon: "fa-spa", title: "Facial Treatments", desc: "Rejuvenating facials and skincare routines designed to give you glowing, healthy skin." },
              { icon: "fa-gem", title: "Nail Care", desc: "Expert nail care with premium products, from classic polish to intricate nail art designs." },
              { icon: "fa-eye", title: "Eyelash Perming", desc: "Natural-looking lash lifts and perms that make your eyes pop without the daily maintenance." },
              { icon: "fa-magic", title: "Wax Care", desc: "Smooth, gentle waxing treatments for lasting results with minimal discomfort." },
              { icon: "fa-star", title: "Mesotherapy", desc: "Advanced rejuvenation treatments for radiant, youthful, glowing skin." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="contact-card">
                <div className="contact-card-ico" style={{ fontSize: "1.6rem" }}><i className={"fas " + icon} /></div>
                <span className="contact-card-label">{title}</span>
                <span className="contact-card-val" style={{ fontSize: "0.87rem" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: "#0E0710", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <h2 style={{ color: "#fff", marginBottom: 16, fontFamily: "'Bodoni Moda', serif" }}>Ready to Experience the Difference?</h2>
          <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Book your appointment today and discover why clients keep coming back.
          </p>
          <Link to="/bookings" className="btn btn-pink btn-lg">Book Now</Link>
        </div>
      </section>
    </div>
  )
}
