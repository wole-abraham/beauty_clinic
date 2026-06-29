import { useState } from "react"

const MOCK_SERVICES = [
  { id: 1, servicetype: "Artistic Makeup", price: 80 },
  { id: 2, servicetype: "Facial Treatment", price: 60 },
  { id: 3, servicetype: "Nail Care", price: 35 },
  { id: 4, servicetype: "Eyelash Perming", price: 45 },
  { id: 5, servicetype: "Wax Care", price: 25 },
  { id: 6, servicetype: "Mesotherapy", price: 120 },
]

const MOCK_CLIENTS = [
  { id: 1, first_name: "Jane", last_name: "Doe", email: "jane@example.com", phone: "+961 3 111 222" },
  { id: 2, first_name: "Alice", last_name: "Smith", email: "alice@example.com", phone: "+961 70 333 444" },
  { id: 3, first_name: "Sarah", last_name: "Khoury", email: "sarah.k@example.com", phone: "+961 76 555 666" },
]

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    client: MOCK_CLIENTS[0],
    service: MOCK_SERVICES[1],
    date: new Date().toISOString().split("T")[0],
    time: "09:30",
    status: "Scheduled",
  },
  {
    id: 2,
    client: MOCK_CLIENTS[1],
    service: MOCK_SERVICES[0],
    date: new Date().toISOString().split("T")[0],
    time: "11:00",
    status: "Pending",
  },
  {
    id: 3,
    client: MOCK_CLIENTS[2],
    service: MOCK_SERVICES[2],
    date: "2026-06-30",
    time: "14:30",
    status: "Cancelled",
  },
]

export default function Admin() {
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [services, setServices] = useState(MOCK_SERVICES)
  const [clients] = useState(MOCK_CLIENTS)

  // Forms
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAppt, setNewAppt] = useState({
    clientId: MOCK_CLIENTS[0].id,
    serviceId: MOCK_SERVICES[0].id,
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
  })

  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const [newService, setNewService] = useState({ servicetype: "", price: "" })

  const today = new Date().toISOString().split("T")[0]
  const todayAppts = appointments.filter(a => a.date === today && a.status !== "Cancelled")

  // Handlers
  const handleAddAppt = (e) => {
    e.preventDefault()
    const client = clients.find(c => c.id === parseInt(newAppt.clientId))
    const service = services.find(s => s.id === parseInt(newAppt.serviceId))
    const appt = {
      id: Date.now(),
      client,
      service,
      date: newAppt.date,
      time: newAppt.time,
      status: "Scheduled",
    }
    setAppointments([appt, ...appointments])
    setShowAddForm(false)
  }

  const handleStartEdit = (a) => {
    setEditId(a.id)
    setEditForm({
      serviceId: a.service.id,
      date: a.date,
      time: a.time,
      status: a.status,
    })
  }

  const handleSaveEdit = (id) => {
    const service = services.find(s => s.id === parseInt(editForm.serviceId))
    setAppointments(appointments.map(a => {
      if (a.id === id) {
        return {
          ...a,
          service,
          date: editForm.date,
          time: editForm.time,
          status: editForm.status,
        }
      }
      return a
    }))
    setEditId(null)
  }

  const handleCancelAppt = (id) => {
    setAppointments(appointments.map(a => {
      if (a.id === id) {
        return { ...a, status: "Cancelled" }
      }
      return a
    }))
  }

  const handleDeleteAppt = (id) => {
    setAppointments(appointments.filter(a => a.id !== id))
  }

  const handleAddService = (e) => {
    e.preventDefault()
    const newSvc = {
      id: Date.now(),
      servicetype: newService.servicetype,
      price: parseFloat(newService.price) || 0,
    }
    setServices([...services, newSvc])
    setNewService({ servicetype: "", price: "" })
  }

  const handleDeleteService = (id) => {
    setServices(services.filter(s => s.id !== id))
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="section-tag">Management</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Admin Dashboard</h1>
          </div>
          <button className="btn btn-pink" onClick={() => setShowAddForm(!showAddForm)}>
            <i className={`fas ${showAddForm ? "fa-times" : "fa-calendar-plus"}`} /> {showAddForm ? "Close Form" : "Book New Appointment"}
          </button>
        </div>

        {/* Add Appointment Mock Form */}
        {showAddForm && (
          <div className="admin-panel" style={{ marginBottom: 32, padding: 28 }}>
            <h3 style={{ fontFamily: "Bodoni Moda, serif", fontSize: "1.4rem", marginBottom: 20 }}>Book New Appointment (Offline Mode)</h3>
            <form onSubmit={handleAddAppt} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, alignItems: "end" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Client</label>
                <select className="form-select" value={newAppt.clientId} onChange={e => setNewAppt({ ...newAppt, clientId: e.target.value })}>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Service</label>
                <select className="form-select" value={newAppt.serviceId} onChange={e => setNewAppt({ ...newAppt, serviceId: e.target.value })}>
                  {services.map(s => <option key={s.id} value={s.id}>{s.servicetype} (${s.price})</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time</label>
                <input className="form-input" type="time" value={newAppt.time} onChange={e => setNewAppt({ ...newAppt, time: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-pink" style={{ justifyContent: "center", height: "48px" }}>
                Add Appointment
              </button>
            </form>
          </div>
        )}

        {/* Stat Cards */}
        <div className="admin-stats" style={{ marginBottom: 36 }}>
          {[
            { icon: "fa-calendar-check", label: "Active Today", value: todayAppts.length },
            { icon: "fa-users", label: "Total Clients", value: clients.length },
            { icon: "fa-cut", label: "Services Offered", value: services.length },
          ].map(s => (
            <div key={s.label} className="admin-stat">
              <div className="admin-stat-icon"><i className={"fas " + s.icon} /></div>
              <div>
                <div className="admin-stat-num">{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Split Panels */}
        <div className="admin-layout">
          
          {/* Appointments Management Panel */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title">All Appointments</span>
              <span className="badge badge-success">{appointments.length} Appointments</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      {editId === a.id ? (
                        <>
                          <td style={{ fontWeight: 600 }}>{a.client.first_name} {a.client.last_name}</td>
                          <td>
                            <select className="form-select" style={{ padding: "6px 10px" }} value={editForm.serviceId} onChange={e => setEditForm({ ...editForm, serviceId: e.target.value })}>
                              {services.map(s => <option key={s.id} value={s.id}>{s.servicetype}</option>)}
                            </select>
                          </td>
                          <td>
                            <input className="form-input" style={{ padding: "6px 10px" }} type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                          </td>
                          <td>
                            <input className="form-input" style={{ padding: "6px 10px" }} type="time" value={editForm.time} onChange={e => setEditForm({ ...editForm, time: e.target.value })} />
                          </td>
                          <td>
                            <select className="form-select" style={{ padding: "6px 10px" }} value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                              <option>Scheduled</option>
                              <option>Pending</option>
                              <option>Cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="btn-success-sm" onClick={() => handleSaveEdit(a.id)}>Save</button>
                              <button className="btn-danger-sm" onClick={() => setEditId(null)}>Back</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <div style={{ fontWeight: 600 }}>{a.client.first_name} {a.client.last_name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{a.client.phone}</div>
                          </td>
                          <td>{a.service.servicetype} (${a.service.price})</td>
                          <td>{a.date}</td>
                          <td>{a.time}</td>
                          <td>
                            <span className={"badge " + (a.status === "Cancelled" ? "badge-danger" : a.status === "Pending" ? "badge-warning" : "badge-success")}>
                              {a.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="btn-success-sm" onClick={() => handleStartEdit(a)}>Edit</button>
                              {a.status !== "Cancelled" ? (
                                <button className="btn-danger-sm" onClick={() => handleCancelAppt(a.id)}>Cancel</button>
                              ) : (
                                <button className="btn-danger-sm" style={{ opacity: 0.6 }} onClick={() => handleDeleteAppt(a.id)}><i className="fas fa-trash" /></button>
                              )}
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && (
                <p style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontSize: "0.88rem" }}>No appointments logged.</p>
              )}
            </div>
          </div>

          {/* Services Offered Panel */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title">Services offered</span>
              <span className="badge badge-success">{services.length} Total</span>
            </div>
            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              {services.map(s => (
                <div key={s.id} className="svc-item">
                  <span className="svc-item-name">{s.servicetype}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="svc-item-price" style={{ color: "var(--pink)" }}>${s.price.toFixed(2)}</span>
                    <button className="btn-danger-sm" onClick={() => handleDeleteService(s.id)}><i className="fas fa-trash" /></button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddService} className="add-svc-form">
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Create Service</p>
              <input className="add-svc-input" placeholder="Service Title (e.g. Skin Hydration)" value={newService.servicetype} onChange={e => setNewService({ ...newService, servicetype: e.target.value })} required />
              <input className="add-svc-input" type="number" placeholder="Price (USD)" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} required />
              <button type="submit" className="btn btn-pink btn-sm" style={{ justifyContent: "center" }} disabled={!newService.servicetype || !newService.price}>
                <i className="fas fa-plus" /> Add New Service
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
