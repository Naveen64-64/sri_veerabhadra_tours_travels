import { useState } from 'react'
import { FiPhone, FiMail, FiUser, FiSend } from 'react-icons/fi'
import { createBooking } from '../services/bookingService'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setStatus({ type: 'error', text: 'Please fill in your name and phone number.' })
      return
    }
    setLoading(true)
    try {
      await createBooking({
        name: form.name,
        phone: form.phone,
        email: form.email,
        travelDate: new Date().toISOString().split('T')[0],
        fromLocation: 'Contact Form',
        toLocation: 'Contact Form',
        passengers: 1,
        vehicleType: 'car',
        message: form.message || 'Contact form inquiry',
      })
      setStatus({ type: 'success', text: 'Your message has been sent! We will contact you soon.' })
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch {
      setStatus({ type: 'error', text: 'Unable to send message. Please call us at 9542659999.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Get in touch with Sri Veerabhadra Tours and Travels</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', maxWidth: 1000, margin: '0 auto' }}>
            {/* Contact Info */}
            <div>
              <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)', boxShadow: 'var(--shadow-md)', marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-xl)' }}>Sri Veerabhadra Tours and Travels</h2>
                <p style={{ color: 'var(--color-text-medium)', marginBottom: 'var(--space-lg)' }}>
                  Owner: <strong>P.V. Durga Rao</strong>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <a href="tel:9542659999" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(26, 60, 52, 0.05)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ width: 44, height: 44, background: 'var(--color-dark-green)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <FiPhone size={18} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Phone</span>
                      <span style={{ fontWeight: 600 }}>9542659999</span>
                    </div>
                  </a>

                  <a href="mailto:sriveerabhadratoursandtravels@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(212, 168, 67, 0.08)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ width: 44, height: 44, background: 'var(--color-gold)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-dark-navy)' }}>
                      <FiMail size={18} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Email</span>
                      <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>sriveerabhadratoursandtravels@gmail.com</span>
                    </div>
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'var(--space-xl)' }}>
                  <a href="tel:9542659999" className="btn btn-primary">Call Now</a>
                  <a href="mailto:sriveerabhadratoursandtravels@gmail.com" className="btn btn-secondary">Email Us</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Send Us a Message</h3>

              {status && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-lg)', background: status.type === 'success' ? '#d4edda' : '#f8d7da', color: status.type === 'success' ? '#155724' : '#721c24' }}>
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Your phone number" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Your email (optional)" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="How can we help you?" />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                  <FiSend /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
