import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../services/packageService'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', duration: '', places: [], vehicleType: 'both', startingPrice: 0, description: '', inclusions: [], image: '', isDemo: false, isActive: true })
  const [placesText, setPlacesText] = useState('')

  useEffect(() => { loadData() }, [])
  const loadData = async () => { try { const res = await getAllPackages(); setPackages(res.data) } catch {} finally { setLoading(false) } }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = { ...form, places: placesText.split(',').map(p => p.trim()).filter(Boolean) }
    try {
      if (editing) { await updatePackage(editing, data) } else { await createPackage(data) }
      setShowModal(false); setEditing(null); loadData()
    } catch { alert('Error saving package') }
  }

  const handleEdit = (p) => { setForm({ name: p.name, duration: p.duration, places: p.places, vehicleType: p.vehicleType, startingPrice: p.startingPrice, description: p.description, inclusions: p.inclusions || [], image: p.image, isDemo: p.isDemo, isActive: p.isActive }); setPlacesText(p.places.join(', ')); setEditing(p._id); setShowModal(true) }
  const handleDelete = async (id) => { if (window.confirm('Delete?')) { await deletePackage(id); loadData() } }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="admin-page-header">
        <h1>Packages</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ name: '', duration: '', places: [], vehicleType: 'both', startingPrice: 0, description: '', inclusions: [], image: '', isDemo: false, isActive: true }); setPlacesText(''); setEditing(null); setShowModal(true) }}><FiPlus /> Add Package</button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Duration</th><th>Vehicle</th><th>Price</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {packages.map(p => (
              <tr key={p._id}>
                <td><strong>{p.name}</strong></td><td>{p.duration || '—'}</td><td>{p.vehicleType}</td>
                <td>{p.startingPrice > 0 ? `₹${p.startingPrice}` : '—'}</td>
                <td>{p.isActive ? '✅' : '❌'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(p)} style={{ background: 'rgba(212, 168, 67, 0.1)', color: 'var(--color-gold-dark)' }}><FiEdit2 /></button>
                  <button onClick={() => handleDelete(p._id)} style={{ background: 'rgba(201, 68, 68, 0.1)', color: 'var(--color-error)' }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {packages.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No packages yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Package' : 'Add Package'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Duration</label><input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g., 3 Days / 2 Nights" /></div>
                <div className="form-group"><label>Vehicle Type</label>
                  <select value={form.vehicleType} onChange={e => setForm({...form, vehicleType: e.target.value})}><option value="car">Car</option><option value="bus">Bus</option><option value="both">Both</option></select>
                </div>
              </div>
              <div className="form-group"><label>Places (comma-separated)</label><input value={placesText} onChange={e => setPlacesText(e.target.value)} placeholder="Place 1, Place 2" /></div>
              <div className="form-group"><label>Starting Price (₹)</label><input type="number" min="0" value={form.startingPrice} onChange={e => setForm({...form, startingPrice: parseFloat(e.target.value) || 0})} /></div>
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
