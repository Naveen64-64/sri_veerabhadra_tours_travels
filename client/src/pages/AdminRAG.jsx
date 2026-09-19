import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiUpload } from 'react-icons/fi'
import { getRAGDocuments, ingestRAGDocument, updateRAGDocument, deleteRAGDocument, reindexRAGDocument, ingestAllData, getRAGStatus } from '../services/ragService'
import { LoadingSpinner } from '../components/LoadingSpinner'

const CATEGORIES = ['company', 'vehicle', 'bus', 'car', 'route', 'destination', 'package', 'faq', 'policy', 'service']

export default function AdminRAG() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', category: 'general', source: '', metadata: {} })
  const [status, setStatus] = useState(null)

  useEffect(() => { loadData(); loadStatus() }, [])

  const loadData = async () => {
    try { const res = await getRAGDocuments(); setDocs(res.data) } catch {} finally { setLoading(false) }
  }

  const loadStatus = async () => {
    try { const res = await getRAGStatus(); setStatus(res.data) } catch {}
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await updateRAGDocument(editing, form) } else { await ingestRAGDocument(form) }
      setShowModal(false); setEditing(null); loadData(); loadStatus()
    } catch { alert('Error saving document') }
  }

  const handleEdit = (d) => { setForm({ title: d.title, content: d.content, category: d.category, source: d.source, metadata: d.metadata || {} }); setEditing(d._id); setShowModal(true) }
  const handleDelete = async (id) => { if (window.confirm('Delete this document?')) { await deleteRAGDocument(id); loadData(); loadStatus() } }
  const handleReindex = async (id) => { await reindexRAGDocument(id); alert('Document re-indexed!') }

  const handleIngestAll = async () => {
    if (window.confirm('This will ingest all vehicles and FAQs into RAG. Continue?')) {
      try { const res = await ingestAllData(); alert(`Ingested ${res.data.vehicles_ingested} vehicles and ${res.data.faqs_ingested} FAQs`); loadData(); loadStatus() } catch { alert('Error ingesting data') }
    }
  }

  if (loading) return <LoadingSpinner message="Loading RAG documents..." />

  return (
    <div>
      <div className="admin-page-header">
        <h1>RAG Knowledge Base</h1>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleIngestAll}><FiUpload /> Ingest All Data</button>
          <button className="btn btn-primary" onClick={() => { setForm({ title: '', content: '', category: 'general', source: '', metadata: {} }); setEditing(null); setShowModal(true) }}>
            <FiPlus /> Add Document
          </button>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="admin-stat-card" style={{ flex: 1, minWidth: 180 }}>
            <div className="stat-value">{status.rag_documents_count}</div>
            <div className="stat-label">RAG Documents</div>
          </div>
          <div className="admin-stat-card" style={{ flex: 1, minWidth: 180 }}>
            <div className="stat-value" style={{ fontSize: '1rem', color: status.ollama?.ollama_running ? 'var(--color-success)' : 'var(--color-error)' }}>
              {status.ollama?.ollama_running ? '✅ Running' : '❌ Offline'}
            </div>
            <div className="stat-label">Ollama ({status.ollama?.model})</div>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Source</th><th>Actions</th></tr></thead>
          <tbody>
            {docs.map(d => (
              <tr key={d._id}>
                <td><strong>{d.title}</strong><br /><span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{d.content.substring(0, 100)}...</span></td>
                <td><span className="badge badge-gold">{d.category}</span></td>
                <td style={{ fontSize: '0.85rem' }}>{d.source || '—'}</td>
                <td className="actions">
                  <button onClick={() => handleReindex(d._id)} style={{ background: 'rgba(26, 60, 52, 0.1)', color: 'var(--color-dark-green)' }} title="Re-index"><FiRefreshCw /></button>
                  <button onClick={() => handleEdit(d)} style={{ background: 'rgba(212, 168, 67, 0.1)', color: 'var(--color-gold-dark)' }}><FiEdit2 /></button>
                  <button onClick={() => handleDelete(d._id)} style={{ background: 'rgba(201, 68, 68, 0.1)', color: 'var(--color-error)' }}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {docs.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-light)' }}>No RAG documents. Click "Ingest All Data" to populate.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Document' : 'Add RAG Document'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Title *</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="form-group"><label>Content *</label><textarea rows={6} value={form.content} onChange={e => setForm({...form, content: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Source</label><input value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="e.g., business_info" /></div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create & Index'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
