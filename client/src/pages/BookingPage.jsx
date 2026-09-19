import { useState } from 'react'
import { FiSend, FiCheckCircle } from 'react-icons/fi'
import { createBooking } from '../services/bookingService'

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', travelDate: '',
    fromLocation: '', toLocation: '', passengers: 1,
    vehicleType: 'car', message: '',
  })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.travelDate || !form.fromLocation || !form.toLocation) {
      setStatus({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    setLoading(true)
    try {
      await createBooking({
        ...form,
        passengers: parseInt(form.passengers),
      })
      setStatus({ type: 'success', text: 'Booking request submitted successfully! Our team will contact you to confirm.' })
      setForm({ name: '', phone: '', email: '', travelDate: '', fromLocation: '', toLocation: '', passengers: 1, vehicleType: 'car', message: '' })
    } catch (err) {
      setStatus({ type: 'error', text: 'Unable to submit booking. Please call us at 9542659999.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Book Your Travel</h1>
          <p>Submit a booking request and we'll get back to you</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)', boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-sm)' }}>Booking Inquiry Form</h2>
            <p style={{ color: 'var(--color-text-medium)', marginBottom: 'var(--space-xl)' }}>
              Fill in your travel details. All bookings are treated as requests and will be confirmed by our team.
            </p>

            {status && (
              <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: status.type === 'success' ? '#d4edda' : '#f8d7da', color: status.type === 'success' ? '#155724' : '#721c24' }}>
                {status.type === 'success' && <FiCheckCircle size={20} />}
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone number" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" />
                </div>
                <div className="form-group">
                  <label>Travel Date *</label>
                  <input name="travelDate" type="date" value={form.travelDate} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From *</label>
                  <input name="fromLocation" value={form.fromLocation} onChange={handleChange} placeholder="Pickup location" required />
                </div>
                <div className="form-group">
                  <label>To *</label>
                  <input name="toLocation" value={form.toLocation} onChange={handleChange} placeholder="Drop location" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of People *</label>
                  <input name="passengers" type="number" min="1" max="100" value={form.passengers} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Vehicle Type *</label>
                  <select name="vehicleType" value={form.vehicleType} onChange={handleChange}>
                    <option value="car">Car</option>
                    <option value="bus">Bus</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Any additional details or requirements..." />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                <FiSend /> {loading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'var(--color-text-light)', fontSize: '0.85rem' }}>
              Or call us directly: <a href="tel:9542659999" style={{ color: 'var(--color-gold-dark)', fontWeight: 600 }}>9542659999</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
