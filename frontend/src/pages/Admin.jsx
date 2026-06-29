import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/api"

const today = new Date().toISOString().split("T")[0]

export default function Admin() {
  const qc = useQueryClient()

  const { data: appointments = [], isLoading: loadingAppts } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => { const { data } = await api.get("/appointments"); return data },
  })

  const { data: services = [], isLoading: loadingSvcs } = useQuery({
    queryKey: ["services"],
    queryFn: async () => { const { data } = await api.get("/services"); return data },
  })

  const { data: clients = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => { const { data } = await api.get("/users"); return data },
  })

  // ── Appointment mutations ──
  const createAppt = useMutation({
    mutationFn: (body) => api.post("/appointments/admin", body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-appointments"] }); setShowAddForm(false) },
  })

  const updateAppt = useMutation({
    mutationFn: ({ id, ...body }) => api.patch(`/appointments/${id}`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-appointments"] }); setEditId(null) },
  })

  const cancelAppt = useMutation({
    mutationFn: (id) => api.patch(`/appointments/${id}/cancel`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-appointments"] }),
  })

  // ── Service mutations ──
  const createSvc = useMutation({
    mutationFn: (body) => api.post("/services", body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["services"] }); setNewService({ servicetype: "", price: "" }) },
  })

  const deleteSvc = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  })

  // ── Local form state ──
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAppt, setNewAppt] = useState({ client_id: "", service_id: "", date: today, time: "09:00" })
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [newService, setNewService] = useState({ servicetype: "", price: "" })

  const todayAppts = appointments.filter(a => a.date === today && a.status !== "Cancelled")

  const handleAddAppt = (e) => {
    e.preventDefault()
    createAppt.mutate({
      client_id: parseInt(newAppt.client_id),
      service_id: parseInt(newAppt.service_id),
      date: newAppt.date,
      time: newAppt.time,
    })
  }

  const handleStartEdit = (a) => {
    setEditId(a.id)
    setEditForm({ service_id: a.service?.id, date: a.date, time: a.time, status: a.status })
  }

  const handleSaveEdit = () => {
    updateAppt.mutate({
      id: editId,
      service_id: parseInt(editForm.service_id),
      date: editForm.date,
      time: editForm.time,
      status: editForm.status,
    })
  }

  const handleAddService = (e) => {
    e.preventDefault()
    createSvc.mutate({ servicetype: newService.servicetype, price: parseFloat(newService.price) })
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
            <i className={`fas ${showAddForm ? "fa-times" : "fa-calendar-plus"}`} />
            {showAddForm ? "Close" : "Book Appointment"}
          </button>
        </div>

        {/* Add Appointment Form */}
        {showAddForm && (
          <div className="admin-panel" style={{ marginBottom: 32, padding: 28 }}>
            <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: "1.3rem", marginBottom: 20 }}>New Appointment</h3>
            <form onSubmit={handleAddAppt} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, alignItems: "end" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Client</label>
                <select className="form-select" required value={newAppt.client_id} onChange={e => setNewAppt({ ...newAppt, client_id: e.target.value })}>
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Service</label>
                <select className="form-select" required value={newAppt.service_id} onChange={e => setNewAppt({ ...newAppt, service_id: e.target.value })}>
                  <option value="">Select service</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.servicetype} (${s.price})</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" required value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time</label>
                <input className="form-input" type="time" required value={newAppt.time} onChange={e => setNewAppt({ ...newAppt, time: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-pink" style={{ justifyContent: "center", height: 48 }} disabled={createAppt.isPending}>
                {createAppt.isPending ? "Booking…" : "Add Appointment"}
              </button>
            </form>
            {createAppt.isError && <p style={{ color: "red", marginTop: 10, fontSize: "0.85rem" }}>Error: {createAppt.error?.response?.data?.detail || "Failed"}</p>}
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

        <div className="admin-layout">
          {/* Appointments Panel */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title">All Appointments</span>
              <span className="badge badge-success">{appointments.length} total</span>
            </div>
            {loadingAppts ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : (
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
                            <td style={{ fontWeight: 600 }}>{a.client?.first_name} {a.client?.last_name}</td>
                            <td>
                              <select className="form-select" style={{ padding: "5px 8px" }} value={editForm.service_id} onChange={e => setEditForm({ ...editForm, service_id: e.target.value })}>
                                {services.map(s => <option key={s.id} value={s.id}>{s.servicetype}</option>)}
                              </select>
                            </td>
                            <td><input className="form-input" style={{ padding: "5px 8px" }} type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} /></td>
                            <td><input className="form-input" style={{ padding: "5px 8px" }} type="time" value={editForm.time} onChange={e => setEditForm({ ...editForm, time: e.target.value })} /></td>
                            <td>
                              <select className="form-select" style={{ padding: "5px 8px" }} value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                                <option>Scheduled</option>
                                <option>Pending</option>
                                <option>Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button className="btn-success-sm" onClick={handleSaveEdit} disabled={updateAppt.isPending}>Save</button>
                                <button className="btn-danger-sm" onClick={() => setEditId(null)}>Back</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <div style={{ fontWeight: 600 }}>{a.client?.first_name} {a.client?.last_name}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{a.client?.email}</div>
                            </td>
                            <td>{a.service?.servicetype} <span style={{ color: "var(--pink)", fontWeight: 700 }}>${a.service?.price}</span></td>
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
                                {a.status !== "Cancelled" && (
                                  <button className="btn-danger-sm" onClick={() => cancelAppt.mutate(a.id)} disabled={cancelAppt.isPending}>Cancel</button>
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
                  <p style={{ padding: 32, textAlign: "center", color: "var(--muted)", fontSize: "0.88rem" }}>No appointments yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Services Panel */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title">Services</span>
              <span className="badge badge-success">{services.length} total</span>
            </div>
            {loadingSvcs ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : (
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {services.map(s => (
                  <div key={s.id} className="svc-item">
                    <span className="svc-item-name">{s.servicetype}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className="svc-item-price">${parseFloat(s.price).toFixed(2)}</span>
                      <button className="btn-danger-sm" onClick={() => deleteSvc.mutate(s.id)} disabled={deleteSvc.isPending}>
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddService} className="add-svc-form">
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Add Service</p>
              <input className="add-svc-input" placeholder="Service name" required value={newService.servicetype} onChange={e => setNewService({ ...newService, servicetype: e.target.value })} />
              <input className="add-svc-input" type="number" placeholder="Price (USD)" required value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} />
              <button type="submit" className="btn btn-pink btn-sm" style={{ justifyContent: "center" }} disabled={createSvc.isPending || !newService.servicetype || !newService.price}>
                <i className="fas fa-plus" /> {createSvc.isPending ? "Adding…" : "Add Service"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
