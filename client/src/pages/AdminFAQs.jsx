import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '../services/faqService'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', order: 0, isActive: true })

  useEffect(() => { loadData() }, [])
  const loadData = async () => {
    try { const res = await getAllFAQs(); setFaqs(res.data) } catch {} finally { setLoading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await updateFAQ(editing, form) } else { await createFAQ(form) }
      setShowModal(false); setEditing(null); loadData()
    } catch { alert('Error saving FAQ') }
  }

  const handleEdit = (f) => { setForm({ question: f.question, answer: f.answer, category: f.category, order: f.order, isActive: f.isActive }); setEditing(f._id); setShowModal(true) }
  const handleDelete = async (id) => { if (window.confirm('Delete this FAQ?')) { await deleteFAQ(id); loadData() } }

  if (loading) return <LoadingSpinner message="Loading FAQs..." />

  return (
    <div>
      <div className="admin-page-header">
        <h1>FAQs</h1>
        <button className="btn btn-primary" onClick={() => { setForm({ question: '', answer: '', category: 'general', order: 0, isActive: true }); setEditing(null); setShowModal(true) }}>
          <FiPlus /> Add FAQ
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Question</th><th>Category</th><th>Active</th><th>Actions</th></tr></thead>
          <tbody>
            {faqs.map(f => (
              <tr key={f._id}>
                <td><strong>{f.question}</strong><br /><span style={{ fontSize: '0.82rem', color: 'var(--color-text-light)' }}>{f.answer.substring(0, 80)}...</span></td>
                <td><span className="badge badge-green">{f.category}</span></td>
                <td>{f.isActive ? '✅' : '❌'}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(f)} style={{ background: 'rgba(212, 168, 67, 0.1)', color: 'var(--color-gold-dark)' }}><FiEdit2 /></button>
                  <button onClick={() => handleDelete(f._id)} style={{ background: 'rgba(201, 68, 68, 0.1)', color: 'var(--color-error)' }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No FAQs yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Question *</label><input value={form.question} onChange={e => setForm({...form, question: e.target.value})} required /></div>
              <div className="form-group"><label>Answer *</label><textarea rows={4} value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <option value="general">General</option><option value="booking">Booking</option><option value="vehicle">Vehicle</option><option value="tour">Tour</option><option value="payment">Payment</option>
                  </select>
                </div>
                <div className="form-group"><label>Order</label><input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)})} /></div>
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
