import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../services/vehicleService'
import { LoadingSpinner } from '../components/LoadingSpinner'

const EMPTY_VEHICLE = {
  name: '', type: 'car', seats: 4, ac: true, fuelType: 'diesel',
  driverAvailable: true, pricePerDay: 0, pricePerKm: 0,
  description: '', features: [], images: [], availability: true, isDemo: false,
}

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_VEHICLE)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await getVehicles()
      setVehicles(res.data)
    } catch {} finally { setLoading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateVehicle(editing, form)
      } else {
        await createVehicle(form)
      }
      setShowModal(false)
      setEditing(null)
      setForm(EMPTY_VEHICLE)
      loadData()
    } catch (err) {
      alert('Error saving vehicle')
    }
  }

  const handleEdit = (v) => {
    setForm({
      name: v.name, type: v.type, seats: v.seats, ac: v.ac,
      fuelType: v.fuelType, driverAvailable: v.driverAvailable,
      pricePerDay: v.pricePerDay, pricePerKm: v.pricePerKm,
      description: v.description, features: v.features || [],
      images: v.images || [], availability: v.availability, isDemo: v.isDemo,
    })
    setEditing(v._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this vehicle?')) {
      await deleteVehicle(id)
      loadData()
    }
  }

  if (loading) return <LoadingSpinner message="Loading vehicles..." />

  return (
    <div>
      <div className="admin-page-header">
        <h1>Vehicles</h1>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_VEHICLE); setEditing(null); setShowModal(true) }}>
          <FiPlus /> Add Vehicle
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Type</th><th>Seats</th><th>AC</th><th>Price/Day</th><th>Available</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v._id}>
                <td><strong>{v.name}</strong>{v.isDemo && <span className="badge badge-gold" style={{ marginLeft: 8 }}>Demo</span>}</td>
                <td>{v.type === 'car' ? '🚗 Car' : '🚌 Bus'}</td>
                <td>{v.seats}</td>
                <td>{v.ac ? 'Yes' : 'No'}</td>
                <td>{v.pricePerDay > 0 ? `₹${v.pricePerDay}` : '—'}</td>
                <td><span className={`badge ${v.availability ? 'badge-confirmed' : 'badge-cancelled'}`}>{v.availability ? 'Yes' : 'No'}</span></td>
                <td className="actions">
                  <button onClick={() => handleEdit(v)} style={{ background: 'rgba(212, 168, 67, 0.1)', color: 'var(--color-gold-dark)' }}><FiEdit2 /></button>
                  <button onClick={() => handleDelete(v._id)} style={{ background: 'rgba(201, 68, 68, 0.1)', color: 'var(--color-error)' }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No vehicles yet. Add your first vehicle.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Seats</label>
                  <input type="number" min="1" value={form.seats} onChange={e => setForm({...form, seats: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Fuel Type</label>
                  <select value={form.fuelType} onChange={e => setForm({...form, fuelType: e.target.value})}>
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="cng">CNG</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Day (₹)</label>
                  <input type="number" min="0" value={form.pricePerDay} onChange={e => setForm({...form, pricePerDay: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label>Price Per KM (₹)</label>
                  <input type="number" min="0" step="0.5" value={form.pricePerKm} onChange={e => setForm({...form, pricePerKm: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={form.ac} onChange={e => setForm({...form, ac: e.target.checked})} style={{ width: 'auto' }} /> AC
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={form.driverAvailable} onChange={e => setForm({...form, driverAvailable: e.target.checked})} style={{ width: 'auto' }} /> Driver Available
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={form.availability} onChange={e => setForm({...form, availability: e.target.checked})} style={{ width: 'auto' }} /> Available
                  </label>
                </div>
              </div>
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
