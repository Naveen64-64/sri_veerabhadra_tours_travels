import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { getAllTours, createTour, updateTour, deleteTour } from '../services/tourService'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function AdminTours() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', startLocation: '', destination: '', duration: '', places: [], busInfo: '', price: 0, description: '', image: '', isDemo: false, isActive: true })
  const [placesText, setPlacesText] = useState('')

  useEffect(() => { loadData() }, [])
  const loadData = async () => { try { const res = await getAllTours(); setTours(res.data) } catch {} finally { setLoading(false) } }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = { ...form, places: placesText.split(',').map(p => p.trim()).filter(Boolean) }
    try {
      if (editing) { await updateTour(editing, data) } else { await createTour(data) }
      setShowModal(false); setEditing(null); loadData()
    } catch { alert('Error saving tour') }
  }

  const handleEdit = (t) => { setForm({ name: t.name, startLocation: t.startLocation, destination: t.destination, duration: t.duration, places: t.places, busInfo: t.busInfo, price: t.price, description: t.description, image: t.image, isDemo: t.isDemo, isActive: t.isActive }); setPlacesText(t.places.join(', ')); setEditing(t._id); setShowModal(true) }
  const handleDelete = async (id) => { if (window.confirm('Delete?')) { await deleteTour(id); loadData() } }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="admin-page-header">
        <h1>Tours</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', startLocation: '', destination: '', duration: '', places: [], busInfo: '', price: 0, description: '', image: '', isDemo: false, isActive: true }); setPlacesText(''); setEditing(null); setShowModal(true) }}><FiPlus /> Add Tour</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>From → To</th><th>Duration</th><th>Price</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {tours.map(t => (
              <tr key={t._id}>
                <td><strong>{t.name}</strong></td><td>{t.startLocation} → {t.destination}</td><td>{t.duration || '—'}</td>
                <td>{t.price > 0 ? `₹${t.price}` : '—'}</td><td>{t.isActive ? '✅' : '❌'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(t)} style={{ background: 'rgba(212, 168, 67, 0.1)', color: 'var(--color-gold-dark)' }}><FiEdit2 /></button>
                  <button onClick={() => handleDelete(t._id)} style={{ background: 'rgba(201, 68, 68, 0.1)', color: 'var(--color-error)' }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {tours.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No tours yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Tour' : 'Add Tour'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Tour Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Start Location</label><input value={form.startLocation} onChange={e => setForm({...form, startLocation: e.target.value})} /></div>
                <div className="form-group"><label>Destination</label><input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Duration</label><input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g., 2 Days / 1 Night" /></div>
                <div className="form-group"><label>Price (₹)</label><input type="number" min="0" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value) || 0})} /></div>
              </div>
              <div className="form-group"><label>Places (comma-separated)</label><input value={placesText} onChange={e => setPlacesText(e.target.value)} /></div>
              <div className="form-group"><label>Bus Info</label><input value={form.busInfo} onChange={e => setForm({...form, busInfo: e.target.value})} /></div>
              <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
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
