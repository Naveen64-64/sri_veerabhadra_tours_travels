import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { getAllDestinations, createDestination, updateDestination, deleteDestination } from '../services/destinationService'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', tourInfo: '', category: 'temple', image: '', isActive: true })

  useEffect(() => { loadData() }, [])
  const loadData = async () => { try { const res = await getAllDestinations(); setDestinations(res.data) } catch {} finally { setLoading(false) } }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await updateDestination(editing, form) } else { await createDestination(form) }
      setShowModal(false); setEditing(null); loadData()
    } catch { alert('Error saving destination') }
  }

  const handleEdit = (d) => { setForm({ name: d.name, description: d.description, tourInfo: d.tourInfo, category: d.category, image: d.image, isActive: d.isActive }); setEditing(d._id); setShowModal(true) }
  const handleDelete = async (id) => { if (window.confirm('Delete?')) { await deleteDestination(id); loadData() } }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="admin-page-header">
        <h1>Destinations</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', description: '', tourInfo: '', category: 'temple', image: '', isActive: true }); setEditing(null); setShowModal(true) }}><FiPlus /> Add Destination</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Category</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {destinations.map(d => (
              <tr key={d._id}>
                <td><strong>{d.name}</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{d.description.substring(0, 60)}</span></td>
                <td><span className="badge badge-green">{d.category}</span></td>
                <td>{d.isActive ? '✅' : '❌'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(d)} style={{ background: 'rgba(212, 168, 67, 0.1)', color: 'var(--color-gold-dark)' }}><FiEdit2 /></button>
                  <button onClick={() => handleDelete(d._id)} style={{ background: 'rgba(201, 68, 68, 0.1)', color: 'var(--color-error)' }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {destinations.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No destinations yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Destination' : 'Add Destination'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="temple">Temple</option><option value="beach">Beach</option><option value="hill_station">Hill Station</option><option value="city">City</option><option value="pilgrimage">Pilgrimage</option>
                </select>
              </div>
              <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="form-group"><label>Tour Info</label><textarea rows={2} value={form.tourInfo} onChange={e => setForm({...form, tourInfo: e.target.value})} /></div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
