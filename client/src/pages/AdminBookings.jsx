import { useState, useEffect } from 'react'
import { getBookings, updateBookingStatus } from '../services/bookingService'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await getBookings()
      setBookings(res.data)
    } catch {} finally { setLoading(false) }
  }

  const handleStatus = async (id, status) => {
    if (window.confirm(`Change status to "${status}"?`)) {
      await updateBookingStatus(id, status)
      loadData()
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <LoadingSpinner message="Loading bookings..." />

  return (
    <div>
      <div className="admin-page-header">
        <h1>Bookings</h1>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th><th>Phone</th><th>Date</th><th>From → To</th><th>Passengers</th><th>Vehicle</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id}>
                <td><strong>{b.name}</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{b.email}</span></td>
                <td>{b.phone}</td>
                <td>{b.travelDate}</td>
                <td>{b.fromLocation} → {b.toLocation}</td>
                <td>{b.passengers}</td>
                <td>{b.vehicleType}</td>
                <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                <td className="actions">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(b._id, 'confirmed')} style={{ background: '#d4edda', color: '#155724' }}>Confirm</button>
                      <button onClick={() => handleStatus(b._id, 'cancelled')} style={{ background: '#f8d7da', color: '#721c24' }}>Cancel</button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => handleStatus(b._id, 'completed')} style={{ background: '#d1ecf1', color: '#0c5460' }}>Complete</button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No bookings found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
