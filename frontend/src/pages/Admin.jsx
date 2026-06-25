import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/api"

export default function Admin() {
  const queryClient = useQueryClient()
  const { data: appointments = [] } = useQuery({ queryKey: ["admin-appts"], queryFn: async () => { const { data } = await api.get("/appointments"); return data } })
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: async () => { const { data } = await api.get("/services"); return data } })
  const { data: clients = [] } = useQuery({ queryKey: ["users"], queryFn: async () => { const { data } = await api.get("/users"); return data } })
  const today = new Date().toISOString().split("T")[0]
  const todayAppts = appointments.filter(a => a.date === today)

  return (
    <div className="admin-page">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <span className="section-tag">Management</span>
          <h1 className="section-title">Admin Dashboard</h1>
        </div>
        <div className="admin-stats">
          {[
            { icon: "fa-calendar-check", label: "Today's Appointments", value: todayAppts.length },
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
          <AppointmentsPanel appointments={appointments} services={services} queryClient={queryClient} />
          <ServicesPanel services={services} queryClient={queryClient} />
        </div>
      </div>
    </div>
  )
}

function AppointmentsPanel({ appointments, services, queryClient }) {
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const updateAppt = useMutation({
    mutationFn: async ({ id, ...data }) => api.patch("/appointments/" + id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-appts"] }); setEditId(null) },
  })
  const cancelAppt = useMutation({
    mutationFn: async (id) => api.patch("/appointments/" + id + "/cancel"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-appts"] }),
  })

  const startEdit = (a) => { setEditId(a.id); setEditForm({ service_id: a.service.id, date: a.date, time: a.time.slice(0,5), status: a.status }) }
  const ef = (k) => (e) => setEditForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span className="admin-panel-title">All Appointments</span>
        <span className="badge badge-info">{appointments.length} total</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead>
            <tr><th>Client</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                {editId === a.id ? (
                  <>
                    <td>{a.client.first_name} {a.client.last_name}</td>
                    <td>
                      <select value={editForm.service_id} onChange={e => setEditForm(f => ({ ...f, service_id: parseInt(e.target.value) }))}>
                        {services.map(s => <option key={s.id} value={s.id}>{s.servicetype}</option>)}
                      </select>
                    </td>
                    <td><input type="date" value={editForm.date} onChange={ef("date")} /></td>
                    <td><input type="time" value={editForm.time} onChange={ef("time")} /></td>
                    <td>
                      <select value={editForm.status} onChange={ef("status")}>
                        <option>Scheduled</option><option>Pending</option><option>Cancelled</option>
                      </select>
                    </td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn-success-sm" onClick={() => updateAppt.mutate({ id: a.id, ...editForm, time: editForm.time+":00" })}>Save</button>
                      <button className="btn-danger-sm" onClick={() => setEditId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{a.client.first_name} {a.client.last_name}</td>
                    <td>{a.service.servicetype}</td>
                    <td>{new Date(a.date+"T00:00").toLocaleDateString()}</td>
                    <td>{a.time}</td>
                    <td><span className={"badge " + (a.status==="Cancelled" ? "badge-danger" : a.status==="Pending" ? "badge-warning" : "badge-success")}>{a.status}</span></td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn-success-sm" onClick={() => startEdit(a)}>Edit</button>
                      {a.status !== "Cancelled" && <button className="btn-danger-sm" onClick={() => cancelAppt.mutate(a.id)}>Cancel</button>}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <p style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: "0.88rem" }}>No appointments yet.</p>}
      </div>
    </div>
  )
}

function ServicesPanel({ services, queryClient }) {
  const [form, setForm] = useState({ servicetype: "", price: "" })

  const addSvc = useMutation({
    mutationFn: () => api.post("/services", { servicetype: form.servicetype, price: parseFloat(form.price) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["services"] }); setForm({ servicetype: "", price: "" }) },
  })
  const removeSvc = useMutation({
    mutationFn: (id) => api.delete("/services/" + id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  })

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span className="admin-panel-title">Services</span>
        <span className="badge badge-info">{services.length}</span>
      </div>
      {services.map(s => (
        <div key={s.id} className="svc-item">
          <span className="svc-item-name">{s.servicetype}</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="svc-item-price">${parseFloat(s.price).toFixed(2)}</span>
            <button className="btn-danger-sm" onClick={() => removeSvc.mutate(s.id)}><i className="fas fa-trash" /></button>
          </div>
        </div>
      ))}
      <div className="add-svc-form">
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Add Service</p>
        <input className="add-svc-input" placeholder="Service name" value={form.servicetype} onChange={e => setForm(f => ({ ...f, servicetype: e.target.value }))} />
        <input className="add-svc-input" type="number" placeholder="Price (USD)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
        <button className="btn btn-pink btn-sm" style={{ justifyContent: "center" }} onClick={() => addSvc.mutate()} disabled={!form.servicetype || !form.price || addSvc.isPending}>
          <i className="fas fa-plus" /> Add Service
        </button>
      </div>
    </div>
  )
}
