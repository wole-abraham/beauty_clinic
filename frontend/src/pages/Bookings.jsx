import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import api from "../lib/api"

const HOURS = [
  ["Saturday","08:30 am - 6:00 pm"],["Sunday","08:30 am - 12:00 pm"],
  ["Monday","Closed"],["Tuesday","08:30 am - 6:00 pm"],
  ["Wednesday","Closed"],["Thursday","08:30 am - 6:00 pm"],["Friday","08:30 am - 6:00 pm"],
]

export default function Bookings() {
  const [sel, setSel] = useState({ service: null, date: null, time: null })
  const [booked, setBooked] = useState(null)

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => { const { data } = await api.get("/services"); return data },
  })
  const { data: days = [] } = useQuery({
    queryKey: ["available-days"],
    queryFn: async () => { const { data } = await api.get("/appointments/available-days"); return data.days },
  })
  const { data: times = [], isFetching: loadingTimes } = useQuery({
    queryKey: ["available-times", sel.service?.id, sel.date],
    queryFn: async () => {
      const { data } = await api.get("/appointments/available-times", { params: { service_id: sel.service.id, date: sel.date } })
      return data.available_times
    },
    enabled: !!sel.service && !!sel.date,
  })

  const book = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/appointments", { service_id: sel.service.id, date: sel.date, time: sel.time + ":00" })
      return data
    },
    onSuccess: (data) => setBooked(data),
  })

  const parsedDays = days.map(d => {
    const dt = new Date(d + "T00:00")
    return { raw: d, wday: dt.toLocaleDateString("en-US",{weekday:"short"}), num: dt.getDate(), mon: dt.toLocaleDateString("en-US",{month:"short"}) }
  })

  if (booked) return (
    <div className="confirm-wrap">
      <div className="confirm-card">
        <div className="confirm-icon"><i className="fas fa-check" /></div>
        <h2 className="confirm-title">Booking Confirmed!</h2>
        <p className="confirm-desc">
          Your <strong>{booked.service.servicetype}</strong> appointment is scheduled for <strong>{new Date(booked.date+"T00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</strong> at <strong>{booked.time}</strong>.<br /><br />A confirmation email has been sent to you.
        </p>
        <div className="confirm-actions">
          <button className="btn btn-outline" onClick={() => { setBooked(null); setSel({ service: null, date: null, time: null }) }}>Book Another</button>
          <Link to="/appointments" className="btn btn-pink">My Appointments</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bookings-page">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-tag">Schedule</span>
          <h1 className="section-title">Book an Appointment</h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>Choose your service, pick a date and time that works for you, and we will take care of the rest.</p>
        </div>
        <div className="bookings-layout">
          <div>
            {book.isError && <div className="form-error" style={{ marginBottom: 20 }}>{book.error?.response?.data?.detail || "Failed to book. Please try again."}</div>}

            <div className="booking-card">
              <p className="booking-step-label">Step 01</p>
              <h3 className="booking-step-title">Choose a Service</h3>
              <div className="service-opts">
                {services.map(s => (
                  <button key={s.id} className={"service-opt" + (sel.service?.id === s.id ? " sel" : "")}
                    onClick={() => setSel({ service: s, date: null, time: null })}>
                    <span className="service-opt-name">{s.servicetype}</span>
                    <span className="service-opt-price">${parseFloat(s.price).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {sel.service && (
              <div className="booking-card">
                <p className="booking-step-label">Step 02</p>
                <h3 className="booking-step-title">Pick a Date</h3>
                <div className="date-opts">
                  {parsedDays.map(d => (
                    <button key={d.raw} className={"date-opt" + (sel.date === d.raw ? " sel" : "")}
                      onClick={() => setSel(s => ({ ...s, date: d.raw, time: null }))}>
                      <div className="date-wday">{d.wday}</div>
                      <div className="date-num">{d.num}</div>
                      <div className="date-mon">{d.mon}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sel.date && (
              <div className="booking-card">
                <p className="booking-step-label">Step 03</p>
                <h3 className="booking-step-title">{loadingTimes ? "Loading times..." : "Select a Time"}</h3>
                {!loadingTimes && times.length === 0 && <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No available times for this date. Please pick another day.</p>}
                <div className="time-opts">
                  {times.map(t => (
                    <button key={t} className={"time-opt" + (sel.time === t ? " sel" : "")} onClick={() => setSel(s => ({ ...s, time: t }))}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sel.service && sel.date && sel.time && (
              <div className="booking-card">
                <p className="booking-step-label">Step 04</p>
                <h3 className="booking-step-title">Confirm Booking</h3>
                <div className="summary-card">
                  <div className="summary-row"><span className="summary-label">Service</span><span className="summary-val">{sel.service.servicetype}</span></div>
                  <div className="summary-row"><span className="summary-label">Price</span><span className="summary-val">${parseFloat(sel.service.price).toFixed(2)}</span></div>
                  <div className="summary-row"><span className="summary-label">Date</span><span className="summary-val">{new Date(sel.date+"T00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</span></div>
                  <div className="summary-row"><span className="summary-label">Time</span><span className="summary-val">{sel.time}</span></div>
                </div>
                <button className="btn btn-pink" style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => book.mutate()} disabled={book.isPending}>
                  {book.isPending ? "Booking..." : "Confirm Appointment"}
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="hours-card">
              <p className="hours-title">Opening Hours</p>
              {HOURS.map(([d, h]) => (
                <div key={d} className="hours-row">
                  <span className="hours-day">{d}</span>
                  <span className="hours-time">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
